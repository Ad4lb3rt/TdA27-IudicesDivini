import { browser } from "$app/environment";

// Server-side (SSR in +page.server.ts): reach the backend directly.
// - Local compose (bridge network): BACKEND_URL=http://server:8080/api/v1 (docker DNS).
// - Tour de Cloud (shared localhost): BACKEND_URL unset → http://localhost:8080/api/v1.
// The typeof guard keeps the browser bundle from throwing `process is not defined`.
const SERVER_API_URL =
  typeof process !== "undefined" && process.env.BACKEND_URL
    ? process.env.BACKEND_URL
    : "http://localhost:8080/api/v1";

// Browser: same-origin via Caddy (/api/* → backend). Never leak the internal
// docker hostname (server) to the browser — it doesn't resolve there.
const API_URL = browser ? "/api/v1" : SERVER_API_URL;

// Browser-usable base for URLs rendered into <img src> (SSR + hydration).
// Always same-origin so it works through Caddy in every environment.
const PUBLIC_API_URL = "/api/v1";

const API_KEY = "Kyqc49jIM+5+D0Sed8ZQ671gxkd7W/bBTWjDtZ0Zrgk="

export interface Stop {
  id?: number;
  name: string;
  image_url: string | null;
  wheelchair_accessible: boolean;
  has_shelter: boolean;
  has_ticket_machine: boolean;
}

export async function getHealth(customFetch = fetch): Promise<string> {
  const response = await customFetch(`${API_URL}/health`);
  const statusData: { status: string } = await response.json();
  return statusData.status;
}

export async function getTeamName(customFetch = fetch): Promise<string> {
  const response = await customFetch(`${API_URL}/team/name`);
  let name: string = "";
  await response.text().then((text: string) => {
    name = text;
  });
  return name;
}

export async function getTeamMembers(customFetch = fetch): Promise<string[]> {
  const response = await customFetch(`${API_URL}/team/members`);
  const members: string[] = await response.json();
  return members;
}

export async function getStops(customFetch = fetch): Promise<Stop[]> {
  const res = await customFetch(`${API_URL}/stops`);
  if (!res.ok) throw new Error(`Failed to load stops (${res.status})`);
  const stops: Stop[] = await res.json();
  return stops.map(normalizeStop);
}

export async function getStop(id: number, customFetch = fetch): Promise<Stop> {
  const res = await customFetch(`${API_URL}/stops/${id}`);
  if (res.status === 404) {
    const err = await res.json();
    throw new Error(err.message);
  }
  if (!res.ok) throw new Error(`Failed to load stop (${res.status})`);
  return normalizeStop(await res.json());
}

export async function getStopByName(name: string, customFetch = fetch): Promise<Stop[]> {
  const res = await customFetch(`${API_URL}/stops/search?name=${encodeURIComponent(name)}`)
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const stops: Stop[] = await res.json();
  return stops.map(normalizeStop);
}

export interface StopFilters {
  wheelchair_accessible?: boolean;
  has_shelter?: boolean;
  has_ticket_machine?: boolean;
}

export async function getStopByProperty(wheelchair_accessible: boolean, has_shelter: boolean, has_ticket_machine: boolean, customFetch = fetch): Promise<Stop[]> {
  return searchStopsByFilters({ wheelchair_accessible, has_shelter, has_ticket_machine }, customFetch);
}

export async function searchStopsByFilters(filters: StopFilters, customFetch = fetch): Promise<Stop[]> {
  const params = new URLSearchParams();
  if (filters.wheelchair_accessible) params.set("wheelchair_accessible", "true");
  if (filters.has_shelter) params.set("has_shelter", "true");
  if (filters.has_ticket_machine) params.set("has_ticket_machine", "true");
  if ([...params].length === 0) return getStops(customFetch);
  const res = await customFetch(`${API_URL}/stops/search?${params.toString()}`)
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const stops: Stop[] = await res.json();
  return stops.map(normalizeStop);
}

function normalizeStop(stop: Stop): Stop {
  return {
    ...stop,
    wheelchair_accessible: Boolean(stop.wheelchair_accessible),
    has_shelter: Boolean(stop.has_shelter),
    has_ticket_machine: Boolean(stop.has_ticket_machine)
  };
}

export async function createStop(stop: Omit<Stop, 'id'>, customFetch = fetch): Promise<Stop> {
  const res = await customFetch(`${API_URL}/stops`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
    body: JSON.stringify(stop),
  });
  return res.json();
}

export async function updateStop(id: number, stop: Stop, customFetch = fetch): Promise<Stop> {
  const res = await customFetch(`${API_URL}/stops/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
    body: JSON.stringify(stop),
  });
  if (res.status === 404) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteStop(id: number, customFetch = fetch): Promise<void> {
  const res = await customFetch(`${API_URL}/stops/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${API_KEY}` }
  });
  return res.json();
}

export function resolveImageUrl(image_url: string | null): string | null {
  if (!image_url) return null;
  if (/^https?:\/\//.test(image_url)) return image_url;
  const path = image_url.startsWith("/") ? image_url : `/${image_url}`;
  return `${PUBLIC_API_URL}${path}`;
}
