"use client";
import { useContext, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { getUser } from "../lib/api";
import { keyContext } from "../Contexts/KeyProvider";

export default function ChatsList({ Chats }) {
  const [chats, setChats] = useState(Chats);
  const [inputVisible, setInputVisible] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [log, setLog] = useState("");
  const [error, setError] = useState(false);
  const { userId } = useContext(keyContext);

  function toggleCreate(e) {
    setSearchUsername("");
    setInputVisible(inputVisible ? false : true);
  }
  async function handleSearch(e) {
    setError(false);
    if (e.key === "Enter") {
      const res = await getUser(searchUsername);
      if (res.hasError) {
        setError(res.hasError);
        setLog(res.message);
      } else if (res.id === userId) {
        setError(true);
        setLog("This is you!");
      } else {
        setChats([...chats, { name: res.username }]);
      }
    }
  }
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
        <div
          key={index}
          className="bg-secondary hover:bg-tertiary p-2 mx-2 rounded-2xl cursor-pointer"
        >
          {chat.name}
        </div>
      ))}
    </aside>
  );
}
