# Typescript SvelteKit Frontend Template (English)

Basic SvelteKit 5 (TypeScript) template for displaying, adding, editing, and deleting products in a school cafeteria.

## Running the app

The application requires a running backend API at `http://localhost:8080`.

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## File Structure

- `src/lib/api.ts` - Communication with the backend (GET, POST, PUT, DELETE).
- `src/routes/+page.svelte` - The main component maintaining the application state.
- `src/lib/ProductForm.svelte` - Form for adding and editing.
- `src/lib/ProductTable.svelte` - Rendering the list of products.
- `src/app.css` - Basic styling.

---

# Typescript SvelteKit Frontend Template (Čeština)

Základní SvelteKit 5 (TypeScript) šablona pro zobrazení, přidávání, úpravu a mazání produktů ve školním bufetu.

## Spuštění

Aplikace vyžaduje běžící backend API na adrese `http://localhost:8080`.

1. Instalace závislostí:
```bash
npm install
```

2. Spuštění vývojového serveru:
```bash
npm run dev
```

## Struktura souborů

- `src/lib/api.ts` - Komunikace s backendem (GET, POST, PUT, DELETE).
- `src/routes/+page.svelte` - Hlavní komponenta udržující stav aplikace.
- `src/lib/ProductForm.svelte` - Formulář pro přidání a úpravu.
- `src/lib/ProductTable.svelte` - Vykreslení seznamu produktů.
- `src/app.css` - Základní stylování.
