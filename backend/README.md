[English version is below](#typescript-elysia-backend-template)

# TypeScript Elysia Backend Šablona

Jednoduché API pro správu produktů ve školním bufetu, napsané v TypeScriptu pomocí frameworku Elysia a databáze MySQL. Celá aplikace je v jediném souboru [`src/index.ts`](src/index.ts).

## Požadavky

*   **Bun 1.4 nebo novější:** [Stáhnout Bun](https://bun.sh)
*   **Docker Desktop:** spouští databázi MySQL. [Stáhnout Docker](https://www.docker.com/products/docker-desktop/)

## Spuštění

```bash
bun install
docker compose -f docker/compose.yaml up -d mysql
bun run dev
```

Server běží na `http://127.0.0.1:8080`. Připojení k databázi se nastavuje proměnnou `DATABASE_URL` v souboru `.env`. Tabulka `product` se vytvoří automaticky při startu.

Celý stack (API + MySQL) v Dockeru: `docker compose -f docker/compose.yaml up -d --build`

## API Endpointy

| Metoda | Endpoint | Popis |
| :--- | :--- | :--- |
| `GET` | `/api/product` | Seznam všech produktů |
| `POST` | `/api/product` | Vytvořit nový produkt |
| `PUT` | `/api/product/:id` | Upravit existující produkt (`404`, pokud neexistuje) |
| `DELETE` | `/api/product/:id` | Smazat produkt |

Tělo produktu: `{ "name": "Bageta", "cost": 60 }` — neplatné tělo vrací `422` s popisem chyby.

---

# TypeScript Elysia Backend Template

A simple API for managing products in a school buffet, written in TypeScript with Elysia and MySQL. The whole app lives in a single file, [`src/index.ts`](src/index.ts).

## Prerequisites

*   **Bun 1.4 or higher:** [Download Bun](https://bun.sh)
*   **Docker Desktop:** runs the MySQL database. [Download Docker](https://www.docker.com/products/docker-desktop/)

## Running

```bash
bun install
docker compose -f docker/compose.yaml up -d mysql
bun run dev
```

The server runs at `http://127.0.0.1:8080`. The database connection is set by `DATABASE_URL` in `.env`. The `product` table is created automatically on startup.

Whole stack (API + MySQL) in Docker: `docker compose -f docker/compose.yaml up -d --build`

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/product` | List all products |
| `POST` | `/api/product` | Create a new product |
| `PUT` | `/api/product/:id` | Update an existing product (`404` if missing) |
| `DELETE` | `/api/product/:id` | Delete a product |

Product body: `{ "name": "Baguette", "cost": 60 }` — an invalid body returns `422` with a validation error.
