export async function login(username: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch (error) {
    console.error(error);
    return { message: "Unexpected error", hasError: true };
  }

  if (res.status !== 200) return { ...data, hasError: true };
  return { ...data, hasError: false };
}

export async function register(username: string, password: string) {
  const res = await fetch("/api/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch (error) {
    console.error(error);
    return { message: "Unexpected error", hasError: true };
  }

  if (res.status !== 200) return { ...data, hasError: true };
  return { ...data, hasError: false };
}

export async function getUser(username: string) {
  const res = await fetch(`/api/user/${username.trim()}`, {
    method: "GET",
  });

  let data;
  try {
    data = await res.json();
  } catch (error) {
    console.error(error);
    return { message: "Unexpected error", hasError: true };
  }

  if (res.status !== 200) return { ...data, hasError: true };
  return { ...data, hasError: false };
}

export async function createChat(
  participantsIds: string[],
  title: string = undefined
) {
  const res = await fetch("/api/chats", {
    method: "POST",
    body: JSON.stringify({ participantsIds, title }),
  });
  
  let data;
  try {
    data = await res.json();
  } catch (error) {
    console.error(error);
    return { message: "Unexpected error", hasError: true };
  }

  if (res.status !== 200) return { ...data, hasError: true };
  return { ...data, hasError: false };
}
