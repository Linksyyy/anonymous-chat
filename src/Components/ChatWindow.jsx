"use client";
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useActualOpenedChatProvider } from "../Contexts/ActualOpenedChatProvider";
import { useKeyProvider } from "../Contexts/KeyProvider";
import { getMessagesOfChat } from "../lib/api";
import { client as cryptoClient } from "../lib/cryptography";
import { useActualUserProvider } from "../Contexts/ActualUserProvider";
import { socket } from "../lib/socket";
import { useSocket } from "../lib/useSocket";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [groupKey, setGroupKey] = useState(null);
  const [inputMessage, setInputMessage] = useState("");

  const actualUserManager = useActualUserProvider();
  const actualChatManager = useActualOpenedChatProvider();
  const keyManager = useKeyProvider();

  useEffect(() => {
    if (actualChatManager.id) {
      (async () => {
        const currentGroupKey = await keyManager.getGroupKey(
          actualChatManager.id
        );
        setGroupKey(currentGroupKey);

        const encryptedMessages = (
          await getMessagesOfChat(actualChatManager.id, 1)
        ).result;

        const decryptedPromises = encryptedMessages.map(async (message) => {
          const decryptedContent = await cryptoClient.symmetricDecrypt(
            JSON.parse(message.encrypted_message),
            currentGroupKey
          );
          const { encrypted_message, ...rest } = message;
          return { ...rest, text: decryptedContent };
        });

        const resolvedMessages = await Promise.all(decryptedPromises);
        setMessages(resolvedMessages);
      })();
    }

    socket.emit("join_chat", actualChatManager.id);
    return () => {
      socket.emit("leave_chat", actualChatManager.id);
    };
  }, [actualChatManager.id]);

  useSocket("message_sended", async (message) => {
    if (message.chat_id !== actualChatManager.id) return;

    const encryptedContent = JSON.parse(message.encrypted_message);
    const decryptedText = await cryptoClient.symmetricDecrypt(
      encryptedContent,
      groupKey
    );
    const { encrypted_message, ...rest } = message;
    setMessages((prevMessages) => [
      { ...rest, text: decryptedText },
      ...prevMessages,
    ]);
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!inputMessage.trim() || !groupKey) return;
    const encryptedMessage = await cryptoClient.symmetricEncrypt(
      inputMessage,
      groupKey
    );

    socket.emit("send_message", actualChatManager.id, encryptedMessage);

    setInputMessage("");
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
            {messages.map((message) => (
              <div
                key={message.id} // Corrigido: Usa o ID da mensagem como chave
                className={`flex ${
                  message.sender_id === actualUserManager.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2 lg:max-w-md ${
                    message.sender_id === actualUserManager.id
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
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                }}
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
