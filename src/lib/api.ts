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

export async function getUser(username: string) {
  const res = await fetch(`/api/user/${username.trim()}`, {
    method: "GET",
  });

  if (res.status !== 200) return { ...(await res.json()), hasError: true };
  return { ...(await res.json()), hasError: false };
}

export async function createChat(
  participantsIds: string[],
  title: string = undefined
) {
  const res = await fetch("/api/chats", {
    method: "POST",
    body: JSON.stringify({ participantsIds, title }),
  });

  if (res.status !== 200) return { ...(await res.json()), hasError: true };
  return { ...(await res.json()), hasError: false };
}
