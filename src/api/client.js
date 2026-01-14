const SERVER = import.meta.env.VITE_SERVER_URL;

export async function fetchRefresh(path, init = {}) {
  let res = await fetch(`${SERVER}${path}`, {
    ...init,
    credentials: "include",
  });

  if (res.status !== 401) return res;

  const refreshRes = await fetch(`${SERVER}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) return res;

  return fetch(`${SERVER}${path}`, {
    ...init,
    credentials: "include",
  });
}
