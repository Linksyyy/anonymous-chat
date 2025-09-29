"use client";
import { useEffect, useState } from "react";
import ChatsList from "../../Components/ChatsList";
import { socket } from "../../lib/socket";
import { HiMenu } from "react-icons/hi";

export default function LoungeLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("encrypted-group-keys"))
      localStorage.setItem("encrypted-group-keys", "empty"); // this will prevent some bugs on first chat generation
    socket.connect();
    socket.on("connect", () => console.log("Connected to socket server"));
  }, []);
  return (
    <section className="fixed inset-0 bg-primary-0 flex">
      <ChatsList isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="h-full flex-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 text-white"
        >
          <HiMenu className="h-6 w-6" />
        </button>
        {children}
      </main>
    </section>
  );
}
