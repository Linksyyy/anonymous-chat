import { useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import { socket } from "../lib/socket";

export default function ChatInfo({ chat, toggleVisible }) {
  const [inviteSearchVisible, setInviteSearchVisible] = useState(false);
  const [inviteValue, setInviteValue] = useState("");

  const date = new Date(Date.parse(chat.created_at));
  function toggleInviteSearch() {
    setInviteSearchVisible(inviteSearchVisible ? false : true);
  }
  function handleinviteParticipant(e) {
    console.log(chat);
    if (e.key === "Enter") {
      socket.emit("new_invite", inviteValue, chat.id);
    }
  }
  return (
    <div
      onClick={toggleVisible}
      className="fixed inset-0 bg-secondary-0/16 flex items-center justify-center z-1"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="bg-primary-0 flex flex-col p-5 rounded-4xl gap-5 px-15 max-w-lg w-full ring-1 ring-primary-2"
      >
        <header>
          <h1 className="text-2xl font-bold">Chat info</h1>
        </header>

        <dl className="space-y-2">
          <dt className="font-semibold">Title:</dt>
          <dd className="bg-primary-1 rounded-xl p-2 break-words">
            {chat.title}
          </dd>
        </dl>

        <dl className="space-y-2">
          <dt className="font-semibold">Created at:</dt>
          <dd className="bg-primary-1 rounded-xl p-2">
            {date.toLocaleString("pt-BR")}
          </dd>
        </dl>

        <section className="bg-primary-1 rounded-2xl p-5">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <h2 className="text-xl font-bold">Participants:</h2>
              <button
                onClick={toggleInviteSearch}
                className="bg-green-600 hover:bg-green-700 hover:text-neutral-400 cursor-pointer  rounded-4xl h-8 w-8 flex items-center justify-center"
              >
                <BsPersonAdd className="size-5" />
              </button>
            </div>
            {inviteSearchVisible && (
              <input
                autoFocus
                value={inviteValue}
                onChange={(e) => setInviteValue(e.target.value)}
                onKeyDown={handleinviteParticipant}
                placeholder="Send invite to..."
                className="bg-primary-0 p-2 outline-none my-3 rounded-xl"
              />
            )}
          </div>
          <ul className="space-y-3">
            {chat.participants.map((participant, index) => (
              <li
                key={index}
                className="bg-primary-2 p-3 rounded-2xl text-sm flex justify-between items-center"
              >
                <span>{participant.user.username}</span>
                {participant.role && (
                  <span className="text-xs opacity-75">{participant.role}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
        <button
          type="button"
          onClick={toggleVisible}
          className="bg-neutral-900 hover:bg-neutral-950 py-1 px-3 rounded-2xl"
        >
          Back
        </button>
      </section>
    </div>
  );
}
