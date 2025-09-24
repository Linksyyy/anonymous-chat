"use client";
import { useState } from "react";
import { useActualUserProvider } from "../Contexts/ActualUserProvider";
import { socket } from "../lib/socket";
import { client as cryptoClient } from "../lib/cryptography";

export default function CreateChatForm({ toggleVisible }) {
  const [title, setTitle] = useState("");
  const [errorState, setErrorState] = useState({ hasError: false });

  const actualUserManager = useActualUserProvider();
  async function handleSubmit(e) {
    e.preventDefault();
    const groupKey = await cryptoClient.generateSymmetricKey();
    const encryptedGroupKey = cryptoClient
    socket.emit("new_chat", title);
    toggleVisible();
  }

  return (
    <div
      onClick={toggleVisible}
      className="fixed inset-0 bg-secondary-0/16 flex items-center justify-center z-1"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-primary-0 flex flex-col p-5 rounded-4xl gap-5 px-15 ring-1 ring-primary-2"
      >
        <h1 className="justify-center flex w-full text-2xl font-bold">
          Create chat
        </h1>
        <label>Name new chat</label>
        <input
          autoFocus
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-primary-1 rounded-2xl p-1 outline-none px-5"
        />
        {errorState.hasError && (
          <h1 className="text-red-400 flex justify-center text-sm">
            {errorState.message}
          </h1>
        )}

        <div className="w-full flex justify-evenly gap-4">
          <button
            type="button"
            onClick={toggleVisible}
            className="bg-neutral-900 hover:bg-neutral-950 py-1 px-3 rounded-2xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-800 hover:bg-green-950 py-1 px-3 rounded-2xl"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
