FROM oven/bun:1.4-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY . .

ENV PORT=8080
EXPOSE 8080

USER bun
CMD ["bun", "src/index.ts"]
