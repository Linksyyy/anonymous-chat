"use client";
import { useState } from "react";
import { CiLogin, CiLogout } from "react-icons/ci";
import { login } from "../../lib/main";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const funfou = await login(user, password);
    if (funfou.error) return setError(funfou.message);
    setError(null);
  }

  return (
    <div className="fixed inset-0 bg-black/25 flex items-start justify-center pt-60 overflow-y-auto z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary w-full max-w-md rounded-2xl p-8 flex flex-col"
      >
        {error && (
          <h1 className="text-red-400 justify-center flex">{error.message}</h1>
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
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full p-2 text-lg bg-tertiary mt-1 h-10 rounded"
          />
        </div>
        <div>
          <label className="text-lg mb-1">Password</label>
          <input
            required
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-lg bg-tertiary mt-1 h-10 rounded"
          />
        </div>
        <div className="flex justify-between mt-10">
          <button className="bg-zinc-600 hover:bg-zinc-700 gap-2 font-bold py-2 px-4 rounded flex items-center">
            <CiLogout /> Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 gap-2 font-bold py-2 px-4 rounded flex items-center"
          >
            Login <CiLogin />
          </button>
        </div>
      </form>
    </div>
  );
}
