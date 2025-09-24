"use client";
import { Suspense, useEffect, useState } from "react";
import { MdCancel, MdLogin } from "react-icons/md";
import { login } from "../../lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { client as cryptoClient } from "../../lib/cryptography";
import { useKeyProvider } from "../../Contexts/KeyProvider";
import { useActualUserProvider } from "../../Contexts/ActualUserProvider";

function LoginComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorState, setErrorState] = useState({
    hasError: false,
    message: "",
  });
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectError = searchParams.get("error");
  const keyManager = useKeyProvider();
  const actualUserManager = useActualUserProvider();

  useEffect(() => {
    if (redirectError) {
      switch (redirectError) {
        case "token_expired":
          setErrorState({ hasError: true, message: "Session expired" });
          break;
        default:
          break;
      }
    }
  }, [redirectError]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorState({ hasError: false });
    setUsername(username.trim());
    setPassword(password.trim());
    const preHashedPassword = await cryptoClient.hash(password);
    const { hasError, message, user } = await login(
      username,
      preHashedPassword
    );
    setErrorState({ hasError, message });

    //cant use the state "error" like conditional bc res is async
    if (!hasError) {
      const derivedKey = await cryptoClient.deriveKeyFromPassword(
        preHashedPassword,
        user.ee_salt
      );
      actualUserManager.setId(user.id);
      actualUserManager.setUsername(user.username);
      keyManager.setKey(derivedKey);

      // Decrypt and load the user's key
      const encryptedKeyPayload = JSON.parse(user.encrypted_private_key);
      await keyManager.loadAndSetUserKeys(
        JSON.parse(user.public_key),
        {
          encryptedKeyHex: encryptedKeyPayload.hexEncryptedData,
          ivHex: encryptedKeyPayload.iv,
        },
        derivedKey
      );
      router.push("/lounge");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-primary-1 w-full max-w-md gap-10 rounded-2xl p-8 flex flex-col"
      >
        {errorState.hasError && (
          <h1 className="text-red-400 justify-center flex">
            {errorState.message}
          </h1>
        )}
        <h1 className="text-4xl p-1 justify-center flex mb-4 font-extrabold">
          Login
        </h1>
        <div className="mb-4">
          <label className="text-lg mb-1">User</label>
          <input
            autoFocus
            required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 text-lg bg-primary-2 mt-1 h-10 rounded"
          />
        </div>
        <div>
          <label className="text-lg mb-1">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-lg bg-primary-2 mt-1 h-10 rounded"
          />
        </div>
        <div className="flex justify-between mt-10">
          <Link href="/">
            <button
              type="button"
              className="bg-zinc-600 hover:bg-zinc-700 gap-2 font-bold py-2 px-4 rounded flex items-center"
            >
              <MdCancel /> Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 gap-2 font-bold py-2 px-4 rounded flex items-center"
          >
            Login <MdLogin />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginComponent />
    </Suspense>
  );
}
