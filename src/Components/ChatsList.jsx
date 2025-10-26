"use client";
import { useEffect, useState } from "react";
import { IoMdAddCircleOutline, IoMdClose } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { HiOutlineKey } from "react-icons/hi";
import { FaInfoCircle } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { getNotificationsOfUser, getParticipationsOfUser } from "../lib/api";
import { useActualUserProvider } from "../Contexts/ActualUserProvider";
import { useActualOpenedChatProvider } from "../Contexts/ActualOpenedChatProvider";
import CreateChatForm from "./CreateChatForm";
import ChatInfo from "./ChatInfo";
import Notifications from "./Notifications";
import KeyStatus from "./KeyStatus";
import UserMenu from "./UserMenu";

export default function ChatsList({ isOpen, onClose }) {
  const [createVisible, setCreateVisible] = useState(false);
  const [chatInfoVisible, setChatInfoVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [keyStatusVisible, setKeyStatusVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [chatToSeeInfo, setChatToSeeInfo] = useState(null);

  const { id, username, chats, setChats, notifications, setNotifications } =
    useActualUserProvider();
  const actualOpenedChatManager = useActualOpenedChatProvider();

  useEffect(() => {
    // first load
    if (!id) {
      return;
    }
    const find = async () => {
      const res = await getParticipationsOfUser(id);
      setChats(res.result.map((participation) => participation.chat));
      const resNotf = await getNotificationsOfUser(id);
      setNotifications(resNotf.notifications);
    };
    find();
  }, [id, setChats, setNotifications]);

  async function handleChatClick(e, chat) {
    actualOpenedChatManager.setTitle(chat.title);
    actualOpenedChatManager.setId(chat.id);
    onClose();
  }

  return (
    <>
      {createVisible && (
        <CreateChatForm
          toggleVisible={() => setCreateVisible(createVisible ? false : true)}
          I
        />
      )}
      {notificationsVisible && (
        <Notifications
          toggleVisible={() =>
            setNotificationsVisible(notificationsVisible ? false : true)
          }
          notifications={notifications}
        />
      )}
      {chatInfoVisible && (
        <ChatInfo
          chat={chatToSeeInfo}
          toggleVisible={() =>
            setChatInfoVisible(chatInfoVisible ? false : true)
          }
        />
      )}
      {keyStatusVisible && (
        <KeyStatus
          toggleVisible={() =>
            setKeyStatusVisible(keyStatusVisible ? false : true)
          }
        />
      )}
      {userMenuVisible && (
        <UserMenu
          toggleVisible={() =>
            setUserMenuVisible(userMenuVisible ? false : true)
          }
        />
      )}
      <aside
        className={`bg-primary-0 border-r-1 border-primary-1 gap-2 flex h-full flex-col transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 w-64 fixed inset-y-0 left-0 z-30`}
      >
        <header className="bg-primary-1 p-4 flex flex-col gap-2">
          <div className="items-center justify-center gap-2">
            <div className="w-full justify-between flex">
              <div className="relative">
                <button
                  onClick={() =>
                    setNotificationsVisible(notificationsVisible ? false : true)
                  }
                >
                  <MdOutlineMailOutline className="cursor-pointer text-white hover:text-gray-400 relative size-8" />
                </button>
                {notifications.length > 0 && (
                  <div className="absolute top-0 right-0 bg-primary-0 w-3 h-3 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <button
                    onClick={() =>
                      setKeyStatusVisible(keyStatusVisible ? false : true)
                    }
                  >
                    <HiOutlineKey className="cursor-pointer text-white hover:text-gray-400 size-8" />
                  </button>
                </div>
                <button
                  onClick={() => setCreateVisible(createVisible ? false : true)}
                >
                  <IoMdAddCircleOutline className="cursor-pointer text-white hover:text-gray-400 size-8" />
                </button>
                <button onClick={onClose} className="md:hidden">
                  <IoMdClose className="size-8" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {chats.map((chat, index) => (
          <div
            key={index}
            className={`px-2 mx-2 rounded-2xl cursor-pointer flex relative group justify-evenly items-center ${
              chat.id === actualOpenedChatManager.id
                ? "bg-secondary-0 hover:bg-secondary-1"
                : "bg-primary-1 hover:bg-primary-2"
            }`}
          >
            <button
              onClick={(e) => handleChatClick(e, chat)}
              className="w-8/10 h-10 cursor-pointer flex"
            >
              <TiGroup className="flex size-6 items-center h-full text-neutral-400" />
              <h2 className="w-full items-center h-full text-sm justify-center truncate flex">
                {chat.title}
              </h2>
            </button>
            <button
              className="w-2/10 absolute right-0 justify-center flex items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-neutral-400"
              onClick={() => {
                setChatInfoVisible(chatInfoVisible ? false : true);
                setChatToSeeInfo(chat);
              }}
            >
              <FaInfoCircle className="size-5" />
            </button>
          </div>
        ))}
        <footer className="absolute bottom-0 bg-primary-1 w-full flex items-center justify-between px-3 text-center h-1/18">
          <button
            onClick={() => {
              setUserMenuVisible(userMenuVisible ? false : true);
            }}
            className="p-2 rounded-4xl hover:bg-primary-2 cursor-pointer"
          >
            <CiMenuKebab className="size-6" />
          </button>
          {username && <p>Logged in with {username}</p>}
        </footer>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
