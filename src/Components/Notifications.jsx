"use client";
import { FiCheck, FiX } from "react-icons/fi";
import { socket } from "../lib/socket";

export default function Notifications({ toggleVisible, notifications }) {
  function handleAcceptInvite(notification) {
    socket.emit("accept_invite", notification);
  }
  function handleDenyInvite(notification) {
    socket.emit("deny_invite", notification);
  }

  return (
    <div onClick={toggleVisible} className="fixed inset-0 z-10">
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-12 left-10 bg-primary-1 rounded-tl-none rounded-4xl shadow-lg w-80 ring-1 ring-primary-2"
      >
        <div className="p-4 border-b border-primary-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="p-4">
          {notifications && notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-end inset-0 opacity-0 bg-cover hover:bg-gradient-to-r from-transparent via-primary-2 to-primary-2 hover:opacity-100 rounded-lg z-50 transition-opacity gap-2">
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
                  <li className="p-2">
                    {notification.type === "chat_invite" && (
                      <>
                        <p className="font-semibold">Chat invite</p>
                        <p className="text-sm text-gray-400">
                          The user {notification.sender.username} invited you to
                          chat {notification.chat.title}
                        </p>
                      </>
                    )}
                  </li>
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
