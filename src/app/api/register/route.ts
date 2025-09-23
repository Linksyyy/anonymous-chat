import { NextRequest, NextResponse } from "next/server";
import { findUserByUsername, registerUser } from "../../../db/queries";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { server as cryptoServer } from "../../../lib/cryptography";

const saltRounds = 10;

export async function POST(req: NextRequest) {
  const data = await req.json();
  const username = data.username.trim().toLowerCase();
  const password = data.password.trim();

  if (username === "" || password === "")
    return NextResponse.json(
      { message: "Username and password must be defined" },
      { status: 422 }
    );

  const user = await findUserByUsername(username);

  if (user)
    return NextResponse.json(
      { message: "This user already exist" },
      { status: 401 }
    );

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Minimun password length is 8" },
      { status: 401 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const ee_salt = randomBytes(16).toString("hex");
    const keyPair = await cryptoServer.generateUserKeyPair();
    const pubKey = await cryptoServer.exportKeyToJwt(keyPair.publicKey);
    const privKey = await cryptoServer.exportKeyToJwt(keyPair.privateKey);
    const derivedKey = await cryptoServer.deriveKeyFromPassword(
      password,
      ee_salt
    );
    const encryptedPrivKey = await cryptoServer.symmetricEncrypt(
      privKey,
      derivedKey
    );

    console.log(username, hashedPassword);
    await registerUser(
      username,
      hashedPassword,
      ee_salt,
      pubKey,
      encryptedPrivKey
    );
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (e) {
    console.error(e);
  }
}
