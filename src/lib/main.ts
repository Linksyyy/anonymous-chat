export async function login(username: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (res.status !== 200) return { ...(await res.json()), hasError: true };
  return { ...(await res.json()), hasError: false };
}
export async function register(username: string, password: string) {
  const res = await fetch("/api/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (res.status !== 200) return { ...(await res.json()), hasError: true };
  return { ...(await res.json()), hasError: false };
}
