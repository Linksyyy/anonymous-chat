"use client";
import { useEffect } from "react";
import ChatsList from "../../Components/ChatsList";
import { socket } from "../../lib/socket";

export default function LoungeLayout({ children }) {
  useEffect(() => {
    if (!localStorage.getItem("encrypted-group-keys"))
      localStorage.setItem("encrypted-group-keys", "empty"); // this will prevent some bugs on first chat generation
    socket.connect();
    socket.on("connect", () => console.log("Connected to socket server"));
  }, []);
  return (
    <section className="fixed inset-0 bg-primary-0 flex">
      <ChatsList />
      <main className="h-full flex-1">{children}</main>
    </section>
  );
}
