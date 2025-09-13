"use client";
import { IoSend } from "react-icons/io5";

export default function ChatWindow({ messages }) {
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <main className="h-full overflow-y-auto min-h-0 flex flex-col">
      <header className="h-12 px-5 bg-secondary text-2xl items-center flex">
        teste
      </header>
      <div className="flex flex-col-reverse flex-1 gap-5 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sendedByMe ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-2xl px-4 py-2 lg:max-w-md ${
                message.sendedByMe
                  ? "rounded-br-none bg-purple-950"
                  : "rounded-bl-none bg-secondary"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <footer className="p-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center rounded-full bg-tertiary px-4 py-2"
        >
          <input
            autoFocus
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none"
          />
          <button
            type="submit"
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-950 text-white transition-colors hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <IoSend />
          </button>
        </form>
      </footer>
    </main>
  );
}
