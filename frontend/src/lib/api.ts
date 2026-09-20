// Only called server-side (+page.server). On Tour de Cloud the containers share
// localhost; in local compose (bridge network) BACKEND_URL points at the server service.
const API_URL = process.env.BACKEND_URL ?? "http://localhost:8080/api/v1";

export interface Product {
  id?: number;
  name: string;
  cost: number;
}

export async function getProducts(customFetch = fetch): Promise<Product[]> {
  const res = await customFetch(`${API_URL}/product`);
  return res.json();
}

export async function createProduct(product: Omit<Product, 'id'>, customFetch = fetch): Promise<Product> {
  const res = await customFetch(`${API_URL}/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(id: number, product: Product, customFetch = fetch): Promise<Product> {
  const res = await customFetch(`${API_URL}/product/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (res.status === 404) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteProduct(id: number, customFetch = fetch): Promise<void> {
  const res = await customFetch(`${API_URL}/product/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function getHealth(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/health`);
  return res.json();
}
