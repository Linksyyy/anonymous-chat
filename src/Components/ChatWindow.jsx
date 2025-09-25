"use client";
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useActualOpenedChatProvider } from "../Contexts/ActualOpenedChatProvider";
import { useKeyProvider } from "../Contexts/KeyProvider";

export default function ChatWindow() {
  const [messages] = useState([]);
  const [groupKey, setGroupKey] = useState(null);

  const actualChatManager = useActualOpenedChatProvider();
  const keyManager = useKeyProvider();

  useEffect(() => {
    if (actualChatManager.id)
      (async () => {
        setGroupKey(await keyManager.getGroupKey(actualChatManager.id));
      })();
  }, [actualChatManager.id]);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <main className="h-full overflow-y-auto min-h-0 flex flex-col">
      {actualChatManager.id ? (
        <>
          <header className="h-auto px-5 bg-primary-1 text-2xl justify-between flex py-2 items-center">
            {actualChatManager.title}
            {/*DEBUG*/}
            <h6 className="text-sm text-neutral-600 flex">
              chat id: {actualChatManager.id}
            </h6>
            {/*DEBUG*/}
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
                      : "rounded-bl-none bg-primary-1"
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
              className="flex items-center rounded-full bg-primary-2 px-4 py-2"
            >
              <input
                autoFocus
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-0 text-white transition-colors hover:bg-secondary-1 focus:outline-none focus:ring-2"
              >
                <IoSend />
              </button>
            </form>
          </footer>
        </>
      ) : (
        <div className="h-full items-center flex justify-center text-neutral-500">
          There's nothing opened
        </div>
      )}
    </main>
  );
}
