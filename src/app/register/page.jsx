"use client";
import Link from "next/link";
import { useState } from "react";
import { MdCancel, MdCreate } from "react-icons/md";
import { register } from "../../lib/main";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState(false);
  const [log, setLog] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(false);
    setUsername(username.trim());
    setPassword(password.trim());
    setConfPassword(confPassword.trim());

    if (password !== confPassword) {
      setError(true);
      setLog({ message: "The password confirmation is diferent" });
      return;
    }

    const res = await register(username, password);

    setError(res.hasError);
    setLog(res);

    //cant use state error like conditional bc res is async
    if (res.hasError === false) {
      router.push("/login");
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
          Register
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
        <div>
          <label className="text-lg mb-1">Confirm password</label>
          <input
            required
            type="password"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
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
            Register <MdCreate />
          </button>
        </div>
      </form>
    </div>
  );
}
