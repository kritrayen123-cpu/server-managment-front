const API_URL = process.env.NEXT_PUBLIC_API_URL;


export type ServerStatus = "ONLINE" | "OFFLINE" | "UNKNOWN";

export interface Server {
  id: string;
  hostname: string;
  ssh_port: number;
  ssh_username: string;
  description: string;
  status: ServerStatus;
  created_at: string;
}

export function getServers() {
  return apiFetch<Server[]>("/servers");
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sp_token");
}

export function setToken(token: string) {
  localStorage.setItem("sp_token", token);
}

export function clearToken() {
  localStorage.removeItem("sp_token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    if (res.status === 401) {
      clearToken();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(new Error("Unauthorized"));
    }

    throw new Error(body.message || `Request failed (${res.status})`);
  }

  return res.json();
}

export function login(email: string, password: string) {
  return apiFetch<{ 
    accessToken: string;
  }>(
    "/auth/login",
    { 
      method: "POST", 
      body: JSON.stringify({ email, password }) 
    }
  );
}

export function register(name: string, email: string, password: string) {
  return apiFetch<{ id: string; name: string; email: string; role: string }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify({ name, email, password }) }
  );
}