import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "./schemas";

export async function findUser(username: string) {
  return db.select().from(users).where(eq(users.username, username));
}

export async function registerUser(username: string, password_hash: string) {
  try {
    await db.insert(users).values({ username, password_hash });
  } catch (error) {
    throw new Error(error);
  }
}
