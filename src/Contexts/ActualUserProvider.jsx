"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "../lib/useSocket";
import { useKeyProvider } from "./KeyProvider";
import { client as cryptoClient } from "../lib/cryptography";

const ActualUserContext = createContext();

export function ActualUserProvider({ children }) {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const keyManager = useKeyProvider();
  const privateKey = keyManager.privateKey;

  useEffect(() => {
    const storedUser = localStorage.getItem("actualUser");
    if (storedUser) {
      const { id, username } = JSON.parse(storedUser);
      setId(id);
      setUsername(username);
    }
  }, []);

  const updateId = (newId) => {
    const currentUser = JSON.parse(localStorage.getItem("actualUser")) || {};
    const updatedUser = { ...currentUser, id: newId };
    localStorage.setItem("actualUser", JSON.stringify(updatedUser));
    setId(newId);
  };

  const updateUsername = (newUsername) => {
    const currentUser = JSON.parse(localStorage.getItem("actualUser")) || {};
    const updatedUser = { ...currentUser, username: newUsername };
    localStorage.setItem("actualUser", JSON.stringify(updatedUser));
    setUsername(newUsername);
  };

  useSocket("added_chat", async (chat, base64EncryptedGroupKey) => {
    if (!privateKey) return;
    setChats([...chats, chat]);
    const encryptedGroupKey =
      cryptoClient.base64ToArrayBuffer(base64EncryptedGroupKey);
    const decryptedGroupKey = await cryptoClient.asymmetricDecrypt(
      privateKey,
      encryptedGroupKey
    );
    const jwtGroupKey = JSON.parse(new TextDecoder().decode(decryptedGroupKey));
    const groupKey = await cryptoClient.importKeyFromJwt(jwtGroupKey, "AES-GCM", [
      "encrypt",
      "decrypt",
    ]);
    keyManager.addGroupKey(chat.id, groupKey);
  });
  useSocket("created_notification", (notification) => {
    setNotifications([...notifications, notification]);
  });
  useSocket("notification_deleted", (notfId) => {
    setNotifications(notifications.filter((el) => el.id !== notfId));
  });
  useSocket("chat_deleted", (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
  });
  useSocket("participant_added", (participationData) => {
    const chatIndex = chats.findIndex(
      (chat) => chat.id === participationData.chat_id
    );
    if (chatIndex === -1) return;

    let newChats = chats;
    newChats[chatIndex].participants = [
      ...chats[chatIndex].participants,
      participationData,
    ];

    setChats(newChats);
  });

  const ctx = {
    id,
    setId: updateId,
    username,
    setUsername: updateUsername,
    chats,
    setChats,
    notifications,
    setNotifications,
  };

  return (
    <ActualUserContext.Provider value={ctx}>
      {children}
    </ActualUserContext.Provider>
  );
}

export function useActualUserProvider() {
  return useContext(ActualUserContext);
}
