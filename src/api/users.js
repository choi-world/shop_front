import { fetchRefresh } from "./client";

export async function getMe() {
  return fetchRefresh("/api/users/me", { method: "GET" });
}
