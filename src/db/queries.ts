import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "./schemas";

export async function findUser(username: string) {
  return db.select().from(users).where(eq(users.username, username));
}
