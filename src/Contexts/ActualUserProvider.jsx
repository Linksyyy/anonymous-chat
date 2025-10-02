"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSocket } from "../lib/useSocket";
import { useKeyProvider } from "./KeyProvider";
import { client as cryptoClient } from "../lib/cryptography";

const ActualUserContext = createContext();

export function ActualUserProvider({ children }) {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [initialKeysLoaded, setInitialKeysLoaded] = useState(false);

  const keyManager = useKeyProvider();
  const privateKey = keyManager.privateKey;
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/", "/login", "/register"];

  useEffect(() => {
    const takeEncryptedGroupKeys = async () => {
      if (localStorage.getItem("encrypted-group-keys") === "empty") return;
      if (keyManager.key && !initialKeysLoaded) {
        const encryptedGroupKeys = JSON.parse(
          localStorage.getItem("encrypted-group-keys")
        );
        if (encryptedGroupKeys) {
          const decryptedGroupKeys = await cryptoClient.symmetricDecrypt(
            encryptedGroupKeys,
            keyManager.key
          );

          if (!decryptedGroupKeys) return;

          const groupKeys = new Map(decryptedGroupKeys);
          keyManager.setGroupKeys(groupKeys);
        }
        setInitialKeysLoaded(true);
      }
    };

    takeEncryptedGroupKeys();
  }, [keyManager.key, initialKeysLoaded]);

  useEffect(() => {
    if (id) return;
    setId(null);
    setUsername(null);

    const performLogoutAndRedirect = async () => {
      await fetch("/api/logout", { method: "POST" });
      if (!publicPaths.includes(pathname)) {
        router.push("/login?error=reloaded");
      }
    };

    performLogoutAndRedirect();
  }, [router, publicPaths]);

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

  useSocket("added_chat", async (chat, hexEncryptedGroupKey) => {
    if (!privateKey) {
      console.warn(
        "ActualUserProvider: privateKey is null, cannot decrypt group key."
      );
      return;
    }
    setChats((prevChats) => [...prevChats, chat]);
    const encryptedGroupKeyBuffer =
      cryptoClient.hexToBuffer(hexEncryptedGroupKey);
    const decryptedGroupKeyBuffer = await cryptoClient.asymmetricDecrypt(
      privateKey,
      encryptedGroupKeyBuffer
    );
    const decodedString = new TextDecoder().decode(decryptedGroupKeyBuffer);

    let jwtGroupKey;
    try {
      jwtGroupKey = JSON.parse(decodedString);
      console.log(
        "ActualUserProvider: jwtGroupKey (objeto JWK após JSON.parse):",
        jwtGroupKey
      );
    } catch (error) {
      console.error(
        "ActualUserProvider: Failed to parse decrypted string to JSON:",
        error
      );
      jwtGroupKey = {};
    }

    keyManager.addGroupKey(chat.id, jwtGroupKey);
  });
  useSocket("created_notification", (notification) => {
    setNotifications([...notifications, notification]);
  });
  useSocket("notification_deleted", (notfId) => {
    setNotifications(notifications.filter((el) => el.id !== notfId));
  });
  useSocket("chat_deleted", (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    keyManager.removeGroupKey(chatId);
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
  useSocket("participant_deleted", (chatId, participaionId) => {
    const chatIndex = chats.findIndex((chat) => chat.id === chatId);
    if (chatIndex === -1) return;

    let newChats = chats;
    newChats[chatIndex].participants = chats[chatIndex].participants.filter(
      (p) => p.id !== participaionId
    );

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
