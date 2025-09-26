export async function login(username: string, preHashedpassword: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, preHashedpassword }),
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

export async function register(
  username: string,
  preHashedpassword: string,
  ee_salt: string,
  pubKey: JsonWebKey,
  privKey: {
    iv: string;
    hexEncryptedData: string;
  }
) {
  const res = await fetch("/api/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      preHashedpassword,
      ee_salt,
      pubKey,
      privKey,
    }),
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

export async function getUser(user_id: string) {
  const res = await fetch(`/api/users/${user_id.trim()}`, {
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

export async function postChat(creatorId: string, title: string = undefined) {
  const res = await fetch("/api/chats", {
    method: "POST",
    body: JSON.stringify({ creatorId, title }),
    headers: { "x-user-id": creatorId },
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

export async function getParticipationsOfUser(userId: string) {
  const params = new URLSearchParams({ userId });
  const res = await fetch(`/api/chats?${params}`, {
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

export async function postChatInvite(
  sender_id,
  receiver_id,
  chat_id,
  type: "chat_invite",
  encrypted_group_key: string
) {
  const res = await fetch(`/api/chats/${chat_id}/invites`, {
    body: JSON.stringify({ receiver_id, type, encrypted_group_key }),
    method: "POST",
    headers: { "x-user-id": sender_id },
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

export async function getNotificationsOfUser(user_id: string) {
  const res = await fetch(`/api/users/${user_id}/notifications`, {
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

export async function getMessagesOfChat(chat_id: string, page: number) {
  const res = await fetch(`/api/chats/${chat_id}/messages?page=${page}`, {
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

export async function getUserByUsername(username: string) {
  const res = await fetch(`/api/username/${username}`, {
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