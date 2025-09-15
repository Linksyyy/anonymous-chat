"use client";
import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { postChat, getUser, getParticipationsOfUser } from "../lib/api";
import { useActualUserProvider } from "../Contexts/ActualUserProvider";
import { useActualOpenedChatProvider } from "../Contexts/ActualOpenedChatProvider";
import CreateChatForm from "./CreateChatForm";

export default function ChatsList() {
  const [chats, setChats] = useState([]);
  const [createVisible, setCreateVisible] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [errorState, setErrorState] = useState({
    hasError: false,
    message: "",
  });

  const actualUserManager = useActualUserProvider();
  const actualOpenedChatManager = useActualOpenedChatProvider();

  useEffect(() => {
    if (!actualUserManager.id) {
      return;
    }
    const find = async () => {
      const res = await getParticipationsOfUser(actualUserManager.id);
      setChats(res.result.map((participation) => participation.chat));
    };
    find();
  }, [actualUserManager.id]);

  function toggleCreate(e) {
    setSearchUsername("");
    setCreateVisible(createVisible ? false : true);
  }

  async function handleSearch(e) {
    if (e.key === "Enter") {
      setSearchUsername("");
      const { hasError, message, ...user } = await getUser(
        searchUsername.trim().toLocaleLowerCase()
      );
      if (hasError) {
        setErrorState({
          hasError,
          message,
        });
      } else if (user.id === actualUserManager.id) {
        setErrorState({ hasError: true, message: "This is you!" });
      } else {
        const { hasError, message, chat } = await postChat([
          actualUserManager.id,
          user.id,
        ]);
        if (hasError) {
          setErrorState({ hasError, message });
          return;
        }
        setChats([chat.chat, ...chats]);
      }
    }
  }

  async function handleChatClick(e, chat) {
    actualOpenedChatManager.setTitle(chat.title);
    actualOpenedChatManager.setId(chat.id);
  }

  useEffect(
    () => setErrorState({ hasError: false }),
    [createVisible, searchUsername]
  );

  return (
    <aside className="overflow-y-auto bg-primary border-r-1 border-secondary gap-2 flex h-full w-64 flex-col">
      <header className="bg-secondary p-4 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          {createVisible && <CreateChatForm toggleVisible={toggleCreate} I/>}
          <div className="w-full justify-end flex">
            <button
              onClick={toggleCreate}
              className="cursor-pointer text-white hover:text-gray-400"
            >
              <IoMdAddCircleOutline className="size-8" />
            </button>
          </div>
        </div>
        {errorState.hasError && (
          <p className="text-red-400 text-center text-sm">
            {errorState.message}
          </p>
        )}
      </header>
      {chats.map((chat, index) => (
        <button
          key={index}
          onClick={(e) => handleChatClick(e, chat)}
          className={`p-2 mx-2 rounded-2xl cursor-pointer ${
            chat.id === actualOpenedChatManager.id
              ? "bg-gray-800 hover:bg-gray-900"
              : "bg-secondary hover:bg-tertiary"
          }`}
        >
          {chat.title}
        </button>
      ))}
    </aside>
  );
}
