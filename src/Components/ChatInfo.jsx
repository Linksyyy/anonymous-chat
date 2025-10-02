import { useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import { ImExit } from "react-icons/im";
import { socket } from "../lib/socket";
import { useActualUserProvider } from "../Contexts/ActualUserProvider";
import { useKeyProvider } from "../Contexts/KeyProvider";
import { getUserByUsername } from "../lib/api";
import { client as cryptoClient } from "../lib/cryptography";

export default function ChatInfo({ chat, toggleVisible }) {
  const [inviteSearchVisible, setInviteSearchVisible] = useState(false);
  const [inviteValue, setInviteValue] = useState("");

  const { id } = useActualUserProvider();
  const keyManager = useKeyProvider();

  const userParticipation = chat.participants.filter(
    (participation) => participation.user_id === id
  )[0];

  const date = new Date(Date.parse(chat.created_at));
  function toggleInviteSearch() {
    setInviteSearchVisible(inviteSearchVisible ? false : true);
  }
  async function handleInviteParticipant(e) {
    if (e.key === "Enter") {
      const user = (await getUserByUsername(inviteValue)).result;
      const userJwtPublicKey = JSON.parse(user.public_key);
      const userPublicKey = await cryptoClient.importKeyFromJwt(
        userJwtPublicKey,
        "RSA-OAEP",
        ["encrypt"]
      );

      const groupKey = await keyManager.getGroupKey(chat.id);
      const jwtGroupKey = await cryptoClient.exportKeyToJwt(groupKey);
      const stringJwtGroupKey = JSON.stringify(jwtGroupKey);
      const encryptedGroupKey = await cryptoClient.asymmetricEncrypt(
        userPublicKey,
        stringJwtGroupKey
      );
      const hexEncryptedGroupKey = cryptoClient.bufferToHex(encryptedGroupKey);

      socket.emit("new_invite", inviteValue, chat.id, hexEncryptedGroupKey);
      setInviteValue("");
      setInviteSearchVisible(false);
    }
  }
  function handleDeleteChat() {
    socket.emit("delete_chat", chat.id);
    toggleVisible();
  }
  function handleExitChat() {
    socket.emit("exit_chat", chat);
    toggleVisible();
  }
  return (
    <div
      onClick={toggleVisible}
      className="fixed inset-0 bg-secondary-0/16 flex items-center justify-center z-40"
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
              <div className="flex gap-4 mb-1">
                <button className="bg-red-700 hover:bg-red-800 hover:text-neutral-500 cursor-pointer rounded-4xl h-8 w-8 flex items-center justify-center">
                  <ImExit onClick={handleExitChat} className="size-5" />
                </button>
                <button className="bg-green-600 hover:bg-green-700 hover:text-neutral-500 cursor-pointer rounded-4xl h-8 w-8 flex items-center justify-center">
                  <BsPersonAdd
                    onClick={toggleInviteSearch}
                    className="size-6"
                  />
                </button>
              </div>
            </div>
            {inviteSearchVisible && (
              <input
                autoFocus
                value={inviteValue}
                onChange={(e) => setInviteValue(e.target.value)}
                onKeyDown={handleInviteParticipant}
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
                <div className="gap-2 flex items-center">
                  <span>{participant.user.username}</span>
                  {participant.user_id === id && (
                    <h6 className="text-blue-800">(you)</h6>
                  )}
                </div>
                <span className="text-xs opacity-75">{participant.role}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="flex w-full flex-row gap-10">
          {userParticipation.role === "admin" && (
            <button
              type="button"
              onClick={handleDeleteChat}
              className="bg-red-800 w-full hover:bg-red-950 py-1 px-3 rounded-2xl"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={toggleVisible}
            className="bg-neutral-900 w-full hover:bg-neutral-950 py-1 px-3 rounded-2xl"
          >
            Back
          </button>
        </section>
      </section>
    </div>
  );
}
