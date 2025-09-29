"use client";
import Link from "next/link";
import { useState } from "react";
import { MdCancel, MdCreate } from "react-icons/md";
import { register } from "../../lib/api";
import { useRouter } from "next/navigation";
import { client as cryptoClient } from "../../lib/cryptography";

function randomHex(size) {
  const buffer = new Uint8Array(size);
  window.crypto.getRandomValues(buffer);
  return Array.from(buffer).map(b => b.toString(16).padStart(2, "0")).join("");
}


export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [errorState, setErrorState] = useState({
    hasError: false,
    message: "",
  });
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorState({ hasError: false });
    setUsername(username.trim());
    setPassword(password.trim());
    setConfPassword(confPassword.trim());

    if (password !== confPassword) {
      setErrorState({
        hasError: true,
        message: "The password confirmation is diferent",
      });
      return;
    }
    const preHashedPassword = await cryptoClient.hash(password);
    const ee_salt = randomHex(16)
    const keyPair = await cryptoClient.generateUserKeyPair();
    const pubKey = await cryptoClient.exportKeyToJwt(keyPair.publicKey);
    const jwtPrivKey = await cryptoClient.exportKeyToJwt(keyPair.privateKey);
    const derivedKey = await cryptoClient.deriveKeyFromPassword(
      password,
      ee_salt
    );
    const encryptedPrivKey = await cryptoClient.symmetricEncrypt(
      jwtPrivKey,
      derivedKey
    );

    const { hasError, message } = await register(
      username,
      preHashedPassword,
      ee_salt,
      pubKey,
      encryptedPrivKey
    );
    setErrorState({ hasError, message });

    //cant use state error like conditional bc res is async
    if (hasError === false) {
      router.push("/login");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-primary-1 max-w-md w-10/12 gap-4 md:gap-8 rounded-2xl p-8 flex flex-col"
      >
        {errorState.hasError && (
          <h1 className="text-red-400 text-sm md:text-lg justify-center flex text-center">
            {errorState.message}
          </h1>
        )}
        <h1 className="text-3xl md:text-4xl justify-center flex font-extrabold">
          Register
        </h1>
        <div className="mb-1">
          <label className="text-lg mb-1">User</label>
          <input
            autoFocus
            required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 text-lg bg-primary-2 mt-1 h-8 md:h-10 rounded"
          />
        </div>
        <div>
          <label className="text-lg mb-1">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-lg bg-primary-2 mt-1 h-8 md:h-10 rounded"
          />
        </div>
        <div>
          <label className="text-lg mb-1">Confirm password</label>
          <input
            required
            type="password"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            className="w-full p-2 text-lg bg-primary-2 mt-1 h-8 md:h-10 rounded"
          />
        </div>
        <div className="flex justify-between mt-5 md:mt-10">
          <Link href="/">
            <button
              type="button"
              className="bg-zinc-600 hover:bg-zinc-700 gap-2 font-bold py-2 px-4 rounded flex items-center text-sm md:text-lg"
            >
              <MdCancel /> Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 gap-2 font-bold py-2 px-4 rounded flex items-center text-sm md:text-lg"
          >
            Register <MdCreate />
          </button>
        </div>
      </form>
    </div>
  );
}
