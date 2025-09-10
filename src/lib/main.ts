export async function login(user: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username: user, password }),
  });

  if (res.status !== 200) return { message: await res.json(), hasError: true };
  return { message: await res.json(), hasError: false };
}
