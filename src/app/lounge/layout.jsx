"use client";
import { useEffect } from "react";
import ChatsList from "../../Components/ChatsList";
import { socket } from "../../lib/socket";

export default function LoungeLayout({ children }) {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    return () => {
      socket.off("connect");
    };
  }, []);
  return (
    <section className="fixed inset-0 bg-primary-0 flex">
      <ChatsList />
      <main className="h-full flex-1">{children}</main>
    </section>
  );
}
