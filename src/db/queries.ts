import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "./schemas";
import { randomBytes } from "crypto";

export async function findUser(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return result[0];
}

export async function registerUser(username: string, password_hash: string) {
  try {
    const ee_salt = randomBytes(16).toHex();
    await db.insert(users).values({ username, password_hash, ee_salt });
  } catch (error) {
    throw new Error(error);
  }
}
