"use client";
import { useState } from "react";

export default function ChatsList({Chats}) {
  const [chats] = useState(Chats);
  return (
    <aside className="bg-primary border-r-1 border-secondary gap-2 flex h-full absolute w-64 flex-col">
      {chats.map((chat, index) => (
        <div key={index} className="bg-secondary hover:bg-tertiary p-2 mx-4 mt-2 rounded-2xl">
          {chat.name}
        </div>
      ))}
    </aside>
  );
}
