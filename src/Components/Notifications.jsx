"use client";
import { FiCheck, FiX } from "react-icons/fi";
import { socket } from "../lib/socket";
import { useKeyProvider } from "../Contexts/KeyProvider";

export default function Notifications({ toggleVisible, notifications }) {
  const keyManager = useKeyProvider();

  function handleAcceptInvite(notification) {
    console.log(notification);
    socket.emit("accept_invite", notification);
  }
  function handleDenyInvite(notification) {
    socket.emit("deny_invite", notification);
  }

  return (
    <div onClick={toggleVisible} className="fixed inset-0 z-40">
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-12 left-10 bg-primary-1 rounded-tl-none rounded-4xl shadow-lg w-80 ring-1 ring-primary-2"
      >
        <div className="p-4 border-b border-primary-2 flex justify-between">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={toggleVisible}>
            <FiX className="size-8 hover:text-neutral-500 cursor-pointer" />
          </button>
        </div>
        <div className="p-4">
          {notifications && notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-center md:relative">
                  <li className="p-2 flex-grow">
                    {notification.type === "chat_invite" && (
                      <>
                        <p className="font-semibold">Chat invite</p>
                        <p className="text-sm text-gray-400">
                          The user{" "}
                          <span className="font-bold text-neutral-300">
                            {notification.sender.username}
                          </span>{" "}
                          invited you to chat{" "}
                          <span className="font-bold text-neutral-300">
                            {notification.chat.title}
                          </span>
                        </p>
                      </>
                    )}
                  </li>
                  <div className="flex items-center justify-end gap-2 p-2 md:p-0 md:absolute md:inset-0 md:bg-cover md:rounded-lg md:z-50 md:opacity-0 md:hover:opacity-100 md:hover:bg-gradient-to-r from-transparent via-primary-2 to-primary-2">
                    <button
                      onClick={() => handleAcceptInvite(notification)}
                      className="hover:text-neutral-500 cursor-pointer"
                    >
                      <FiCheck className="size-8" />
                    </button>
                    <button
                      onClick={() => handleDenyInvite(notification)}
                      className="hover:text-neutral-500 cursor-pointer"
                    >
                      <FiX className="size-8" />
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No new notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}
