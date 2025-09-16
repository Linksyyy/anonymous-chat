"use client";
import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { getParticipationsOfUser } from "../lib/api";
import { useActualUserProvider } from "../Contexts/ActualUserProvider";
import { useActualOpenedChatProvider } from "../Contexts/ActualOpenedChatProvider";
import CreateChatForm from "./CreateChatForm";
import ChatInfo from "./ChatInfo";

export default function ChatsList() {
  const [createVisible, setCreateVisible] = useState(false);
  const [chatInfoVisible, setChatInfoVisible] = useState(false);

  const { chats, id, setChats } = useActualUserProvider();
  const actualOpenedChatManager = useActualOpenedChatProvider();

  useEffect(() => {
    if (!id) {
      return;
    }
    const find = async () => {
      const res = await getParticipationsOfUser(id);
      setChats(res.result.map((participation) => participation.chat));
    };
    find();
  }, [id, setChats]);

  function toggleCreate(e) {
    setCreateVisible(createVisible ? false : true);
  }
  function toggleChatInfo(e) {
    setChatInfoVisible(chatInfoVisible ? false : true);
  }

  async function handleChatClick(e, chat) {
    actualOpenedChatManager.setTitle(chat.title);
    actualOpenedChatManager.setId(chat.id);
  }

  return (
    <aside className="overflow-y-auto bg-primary border-r-1 border-secondary gap-2 flex h-full w-64 flex-col">
      <header className="bg-secondary p-4 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          {createVisible && <CreateChatForm toggleVisible={toggleCreate} I />}
          <div className="w-full justify-end flex">
            <button
              onClick={toggleCreate}
              className="cursor-pointer text-white hover:text-gray-400"
            >
              <IoMdAddCircleOutline className="size-8" />
            </button>
          </div>
        </div>
      </header>
      {chats.map((chat, index) => (
        <div
          key={index}
          className={`p-2 mx-2 rounded-2xl cursor-pointer flex group justify-evenly ${
            chat.id === actualOpenedChatManager.id
              ? "bg-gray-800 hover:bg-gray-900"
              : "bg-secondary hover:bg-tertiary"
          }`}
        >
          <button
            onClick={(e) => handleChatClick(e, chat)}
            className="w-8/10 cursor-pointer"
          >
            {chat.title}
          </button>
          <button
            onClick={toggleChatInfo}
            className="w-2/10 justify-center flex items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-neutral-400"
          >
            <FaInfoCircle className="size-5" />
          </button>
          {chatInfoVisible && (
            <ChatInfo chat={chat} toggleVisible={toggleChatInfo} />
          )}
        </div>
      ))}
    </aside>
  );
}
