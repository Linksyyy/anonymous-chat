"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "../lib/useSocket";
import { client as cryptoClient } from "../lib/cryptography";
import { useKeyProvider } from "./KeyProvider";

const ActualUserContext = createContext();

export function ActualUserProvider({ children }) {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);

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

  const loadAndSetUserKeys = async (
    publicKey,
    privateKey,
    passwordDerivedKey
  ) => {
    const { encryptedKeyHex, ivHex } = privateKey;
    const decryptedJwk = await cryptoClient.symmetricDecrypt(
      { encryptedData: encryptedKeyHex, iv: ivHex },
      passwordDerivedKey
    );

    if (decryptedJwk) {
      const privateKeyObject = await cryptoClient.importKeyFromJwt(
        decryptedJwk,
        "RSA-OAEP",
        ["decrypt"]
      );
      setPrivateKey(privateKeyObject);

      const publicKeyObject = await cryptoClient.importKeyFromJwt(
        publicKey,
        "RSA-OAEP",
        ["encrypt"]
      );
      setPublicKey(publicKeyObject);
    } else {
      console.error(
        "Failed to decrypt the private key. The password might be wrong."
      );
    }
  };

  useSocket("added_chat", (chat) => {
    setChats([...chats, chat]);
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
    publicKey,
    privateKey,
    loadAndSetUserKeys,
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
