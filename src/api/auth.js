const SERVER = import.meta.env.VITE_SERVER_URL;

export async function logout() {
  const res = await fetch(`${SERVER}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  return res;
}

export async function register(payload) {
  const res = await fetch(`${SERVER}/api/account/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return res;
}
