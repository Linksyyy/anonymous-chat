"use client";
import { useState } from "react";
import { MdCancel, MdLogin } from "react-icons/md";
import { login } from "../../lib/main";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [log, setLog] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(false);
    setUsername(username.trim());
    setPassword(password.trim());

    const res = await login(username, password);

    setError(res.hasError);
    setLog({ ...res });

    //cant use the state "error" like conditional bc res is async
    if (!res.hasError) {
      router.push("/lounge");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary w-full max-w-md gap-10 rounded-2xl p-8 flex flex-col"
      >
        {error && (
          <h1 className="text-red-400 justify-center flex">{log.message}</h1>
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
            className="w-full p-2 text-lg bg-tertiary mt-1 h-10 rounded"
          />
        </div>
        <div>
          <label className="text-lg mb-1">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-lg bg-tertiary mt-1 h-10 rounded"
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
