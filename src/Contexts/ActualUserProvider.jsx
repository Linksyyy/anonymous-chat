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

  const keyManager = useKeyProvider();
  const privateKey = keyManager.privateKey;
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/", "/login", "/register"];

  useEffect(() => {
    // This cant be in key provider bc it depends on chats state
    const takeEncryptedGroupKeys = async () => {
      if (keyManager.key) {
        const encryptedGroupKeys = JSON.parse(
          localStorage.getItem("encrypted-group-keys")
        );
        if (encryptedGroupKeys) {
          const decryptedGroupKeys = await cryptoClient.symmetricDecrypt(
            encryptedGroupKeys,
            keyManager.key
          );
          const groupKeys = new Map(decryptedGroupKeys);

          //Here will delete groupKeys of chats that the user isnt there anymore
          const groupKeysEntries = Array.from(groupKeys.entries());
          const chatsIds = chats.map((chat) => chat.id);
          groupKeysEntries.map((entrie) => {
            if (!chatsIds.includes(entrie[0])) {
              groupKeys.delete(entrie[0]);
            }
          });

          keyManager.setGroupKeys(groupKeys);
        }
      }
    };

    takeEncryptedGroupKeys();
  }, [keyManager.key, chats]);

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

  useSocket("added_chat", async (chat, base64EncryptedGroupKey) => {
    if (!privateKey) return;
    setChats([...chats, chat]);
    const encryptedGroupKey = cryptoClient.base64ToArrayBuffer(
      base64EncryptedGroupKey
    );
    const decryptedGroupKey = await cryptoClient.asymmetricDecrypt(
      privateKey,
      encryptedGroupKey
    );
    const jwtGroupKey = JSON.parse(new TextDecoder().decode(decryptedGroupKey));
    const groupKey = await cryptoClient.importKeyFromJwt(
      jwtGroupKey,
      "AES-GCM",
      ["encrypt", "decrypt"]
    );
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
