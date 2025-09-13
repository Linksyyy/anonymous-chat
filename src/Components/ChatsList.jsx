"use client";
import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function ChatsList({ Chats }) {
  const [chats] = useState(Chats);
  return (
    <aside className="overflow-y-auto bg-primary border-r-1 border-secondary gap-2 flex h-full absolute w-64 flex-col">
      <header className="bg-secondary items-center justify-end flex h-12 border-r-tertiary border-r-1">
        <button className="m-5 cursor-pointer hover:text-gray-400">
          <IoMdAddCircleOutline className="size-5" />
        </button>
      </header>
      {chats.map((chat, index) => (
        <div
          key={index}
          className="bg-secondary hover:bg-tertiary p-2 mx-4 mt-2 rounded-2xl"
        >
          {chat.name}
        </div>
      ))}
    </aside>
  );
}
