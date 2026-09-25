import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { SQL } from "bun";
import { promises as fs } from "fs";

type Product = { id: number; name: string; cost: number };

// DATABASE_URL, e.g. mysql://tda_user:strongPassword%3F@127.0.0.1:3306/product
// allowPublicKeyRetrieval: MySQL 8 password auth over plain TCP; safe because the DB is on the pod's localhost.
const sql = new SQL(process.env.DATABASE_URL!, { allowPublicKeyRetrieval: true });

// The database may still be starting up (no startup order on Tour de Cloud), so retry.
for (let attempt = 1; ; attempt++) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS product (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      cost INT NOT NULL
      )`;
    break;
  } catch (error) {
    if (attempt === 60) throw error;
    console.log("Waiting for database...");
    await Bun.sleep(1000);
  }
}

const ProductBody = t.Object({ name: t.String(), cost: t.Integer() });

// Allow a frontend dev server on another port (e.g. localhost:3001) to call the API.
const app = new Elysia({ prefix: "/api/v1" })
  .use(cors())
  .get("/product", () => sql<Product[]>`SELECT id, name, cost FROM product ORDER BY id`)
  .post(
    "/product",
    async ({ body }) => {
      const result = await sql`INSERT INTO product (name, cost) VALUES (${body.name}, ${body.cost})`;
      return { id: Number(result.lastInsertRowid), ...body };
    },
    { body: ProductBody },
  )
  .put(
    "product/:id",
    async ({ params: { id }, body, status }) => {
      const [product] = await sql<Product[]>`SELECT id FROM product WHERE id = ${id}`;
      if (!product) return status(404, { message: "Product does not exist" });

      await sql`UPDATE product SET name = ${body.name}, cost = ${body.cost} WHERE id = ${id}`;
      return { id, ...body };
    },
    { params: t.Object({ id: t.Numeric() }), body: ProductBody },
  )
  .delete(
    "product/:id",
    async ({ params: { id } }) => {
      await sql`DELETE FROM product WHERE id = ${id}`;
      return { message: "Product was deleted permanently from DB." };
    },
    { params: t.Object({ id: t.Numeric() }) },
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
    }
  )
  .listen({ hostname: "0.0.0.0", port: Number(process.env.PORT ?? 8080) });

console.log(`Server running on http://${app.server?.hostname}:${app.server?.port}`);
