// Only called server-side (+page.server). On Tour de Cloud the containers share
// localhost; in local compose (bridge network) BACKEND_URL points at the server service.
const API_URL = process.env.BACKEND_URL ?? "http://localhost:8080/api/v1";

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
  return res.json();
}

export async function getStop(id: number, customFetch = fetch): Promise<Stop[]> {
  const res = await customFetch(`${API_URL}/stops/${id}`);
  if (res.status === 404) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function createStop(stop: Omit<Stop, 'id'>, customFetch = fetch): Promise<Stop> {
  const res = await customFetch(`${API_URL}/stops`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stop),
  });
  return res.json();
}

export async function updateStop(id: number, stop: Stop, customFetch = fetch): Promise<Stop> {
  const res = await customFetch(`${API_URL}/stops/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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
  });
  return res.json();
}
