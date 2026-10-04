import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { SQL } from "bun";
import { promises as fs } from "fs";

type Stop = { id: number, name: string, image_url: string | null, wheelchair_accessible: boolean, has_shelter: boolean, has_ticket_machine: boolean }

// DATABASE_URL, e.g. mysql://tda_user:strongPassword%3F@127.0.0.1:3306/product
// allowPublicKeyRetrieval: MySQL 8 password auth over plain TCP; safe because the DB is on the pod's localhost.
const sql = new SQL(process.env.DATABASE_URL!, { allowPublicKeyRetrieval: true });

// The database may still be starting up (no startup order on Tour de Cloud), so retry.
const maxAttemptsBeforeError = 60;
for (let attempt = 1; ; attempt++) {
  try {
    await sql`SELECT 1`;
    break;
  } catch (error) {
    if (attempt === maxAttemptsBeforeError) throw error;
    console.log(`Waiting for database... (attempt ${attempt % maxAttemptsBeforeError}/${maxAttemptsBeforeError})`);
    await Bun.sleep(1000);
  }
}
console.log("Successfully connected to database!")

//!-----This code runs after the backend connects to db, so it is essential to write everything db related here

const API_KEY = "Kyqc49jIM+5+D0Sed8ZQ671gxkd7W/bBTWjDtZ0Zrgk="

const urlPattern = (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g).toString();
const StopBodySchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 255 }),
  image_url: t.Optional(t.Nullable(t.String({ maxLength: 255, pattern: urlPattern }))),
  wheelchair_accessible: t.Boolean(),
  has_shelter: t.Boolean(),
  has_ticket_machine: t.Boolean()
}, { additionalProperties: false });

const BooleanString = t.Optional(t.Union([t.Literal("true"), t.Literal("false")]));

const StopSearchQuerySchema = t.Union([
  // Either require a name
  t.Object(
    {
      name: t.String({ minLength: 1, maxLength: 255 }),
    },
    { additionalProperties: false }
  ),
  // Or require at least one boolean-like string parameter
  t.Object(
    {
      wheelchair_accessible: BooleanString,
      has_shelter: BooleanString,
      has_ticket_machine: BooleanString,
    },
    {
      additionalProperties: false,
      minProperties: 1
    }
  ),
]);

const IdParameterSchema = { id: t.Integer({ minimum: 1 }) }

// Allow a frontend dev server on another port (e.g. localhost:3001) to call the API.
const app = new Elysia({ prefix: "/api/v1", normalize: false })
  .use(cors())
  .onError(({ code, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      return { error: "Stop not found" }
    }
  })
  .get("/stops", async () => (await sql<Stop[]>`SELECT id, name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine FROM stops ORDER BY id`).map(stop =>
    ({ ...stop, wheelchair_accessible: Boolean(stop.wheelchair_accessible), has_shelter: Boolean(stop.has_shelter), has_ticket_machine: Boolean(stop.has_ticket_machine) }))
  )
  .get("/stops/:id",
    async ({ params: { id }, status }) => {
      const [stop] = await sql<Stop[]>`SELECT id, name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine FROM stops WHERE id = ${id}`;
      if (!stop) return status(404, { error: "Stop not found" });
      return { ...stop, wheelchair_accessible: Boolean(stop.wheelchair_accessible), has_shelter: Boolean(stop.has_shelter), has_ticket_machine: Boolean(stop.has_ticket_machine) };
    },
    { params: t.Object({ ...IdParameterSchema }) },
  )
  .get("/stops/search",
    async ({ query, status }) => {
      if ('name' in query) {
        const searchNameLiteral = "%" + query.name + "%";
        const resultStops = await sql<Stop[]>`SELECT id, name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine FROM stops WHERE
        name LIKE ${searchNameLiteral}`;
        if (!resultStops || resultStops.length === 0) return status(404, { error: "Stop not found" });
        return resultStops;
      }
      else {
        const has_shelter = query.has_shelter === "true" ? true : null;
        const wheelchair_accessible = query.wheelchair_accessible === "true" ? true : null;
        const has_ticket_machine = query.has_ticket_machine === "true" ? true : null;

        const resultStops = await sql<Stop[]>`
          SELECT id, name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine 
          FROM stops 
          WHERE 
            (${has_shelter} IS NULL OR has_shelter = ${has_shelter}) AND
            (${wheelchair_accessible} IS NULL OR wheelchair_accessible = ${wheelchair_accessible}) AND
            (${has_ticket_machine} IS NULL OR has_ticket_machine = ${has_ticket_machine})
        `;
        if (!resultStops || resultStops.length === 0) return status(404, { error: "Stop not found" });
        return resultStops;
      }
    },
    {
      query: StopSearchQuerySchema
    }
  )
  .post(
    "/stops",
    async ({ body, status, request }) => {
      const authHeaderData = request.headers.get('Authorization')
      if (!authHeaderData || authHeaderData !== `Bearer ${API_KEY}`) {
        return status(401, { error: "Stop not found" })
      }
      const result = await sql`INSERT INTO stops (name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine)
      VALUES (${body.name}, ${body.image_url}, ${body.wheelchair_accessible}, ${body.has_shelter}, ${body.has_ticket_machine})`;
      return status(201, { id: Number(result.lastInsertRowid), ...body, image_url: body.image_url ?? null });
    },
    {
      body: StopBodySchema
    },
  )
  .put(
    "/stops/:id",
    async ({ params: { id }, body, status, request }) => {
      const authHeaderData = request.headers.get('Authorization')
      if (!authHeaderData || authHeaderData !== `Bearer ${API_KEY}`) {
        return status(401, { error: "Stop not found" })
      }
      const existing = await sql<Stop[]>`SELECT id FROM stops WHERE id = ${id}`;
      if (!existing || existing.length === 0) return status(404, { error: "Stop not found" });

      await sql`UPDATE stops SET name = ${body.name}, image_url = ${body.image_url ?? null}, wheelchair_accessible = ${body.wheelchair_accessible},
       has_shelter = ${body.has_shelter}, has_ticket_machine = ${body.has_ticket_machine} WHERE id = ${id}`;
      return { id, ...body, image_url: body.image_url ?? null };
    },
    { params: t.Object({ ...IdParameterSchema }), body: StopBodySchema },
  )
  .delete(
    "/stops/:id",
    async ({ params: { id }, status, request }) => {
      const authHeaderData = request.headers.get('Authorization')
      if (!authHeaderData || authHeaderData !== `Bearer ${API_KEY}`) {
        return status(401, { error: "Stop not found" })
      }
      const existing = await sql<Stop[]>`SELECT id FROM stops WHERE id = ${id}`;
      if (!existing || existing.length === 0) return status(404, { error: "Stop not found" });
      await sql`DELETE FROM stops WHERE id = ${id}`;
      return status(204)
    },
    { params: t.Object({ ...IdParameterSchema }) },
  )
  .get("/health",
    () => ({
      status: "ok"
    })
  )
  .get("/team/name",
    async ({ set }) => {
      set.headers['Content-Type'] = "text/plain";

      const teamNameQuery = await sql`SELECT id, name FROM team_name`;
      return teamNameQuery[0]["name"];
    }
  )
  .get("/team/members",
    async () => {
      const members = (await sql`SELECT id, name FROM team_members ORDER BY id`);
      let memberNames: string[] = members.map((member: { id: number, name: string }) => {
        return member.name;
      })
      return memberNames;
    }
  )
  .get("/images/:name",
    async ({ params: { name }, set }) => {
      try {
        const image = await fs.readFile(`./src/images/stops/${name}.png`);
        set.headers["Content-Type"] = "image/png";
        return image;
      }
      catch (err) {
        console.error(err);
        set.status = 404;
        return "Image not found";
      }
    },
    { params: t.Object({ name: t.String() }) },
  )
  .listen({ hostname: "0.0.0.0", port: Number(process.env.PORT ?? 8080) });

console.log(`Server running on http://${app.server?.hostname}:${app.server?.port}`);
