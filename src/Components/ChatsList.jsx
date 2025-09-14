"use client";
import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { getUser } from "../lib/api";
import { useActualUserProvider } from "../Contexts/ActualUserProvider";
import { useActualOpenedChatProvider } from "../Contexts/ActualOpenedChatProvider";

export default function ChatsList() {
  const [chats, setChats] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [log, setLog] = useState("");
  const [error, setError] = useState(false);

  const actualUserManager = useActualUserProvider();
  const actualOpenedChatManager = useActualOpenedChatProvider();

  function toggleCreate(e) {
    setSearchUsername("");
    setInputVisible(inputVisible ? false : true);
  }

  async function handleSearch(e) {
    setError(false);
    if (e.key === "Enter") {
      const res = await getUser(searchUsername.trim().toLocaleLowerCase());
      if (res.hasError) {
        setError(res.hasError);
        setLog(res.message);
      } else if (res.id === actualUserManager.id) {
        setError(true);
        setLog("This is you!");
      } else {
        const { hasError, ...rest } = res;
        setChats([rest, ...chats]);
      }
    }
  }

  function handleChatClick(e, chat) {
    actualOpenedChatManager.setUsername(chat.username);
    actualOpenedChatManager.setId(chat.id);
  }

  useEffect(() => setError(false), [inputVisible]);

  return (
    <aside className="overflow-y-auto bg-primary border-r-1 border-secondary gap-2 flex h-full w-64 flex-col">
      <header className="bg-secondary p-4 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          {inputVisible && (
            <input
              autoFocus
              value={searchUsername}
              onKeyDown={handleSearch}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="bg-tertiary outline-none rounded px-2 py-1 text-white w-40"
              placeholder="Enter username..."
            />
          )}
          <div className="w-full justify-end flex">
            <button
              onClick={toggleCreate}
              className="cursor-pointer text-white hover:text-gray-400"
            >
              <IoMdAddCircleOutline className="size-8" />
            </button>
          </div>
        </div>
        {error && <p className="text-red-400 text-center text-sm">{log}</p>}
      </header>
      {chats.map((chat, index) => (
        <button
          key={index}
          onClick={(e) => handleChatClick(e, chat)}
          className="bg-secondary hover:bg-tertiary p-2 mx-2 rounded-2xl cursor-pointer"
        >
          {chat.username}
        </button>
      ))}
    </aside>
  );
}
