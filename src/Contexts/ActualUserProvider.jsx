"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "../lib/useSocket";

const ActualUserContext = createContext();

export function ActualUserProvider({ children }) {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

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

  useSocket("added_chat", (chat) => {
    setChats([...chats, chat]);
  });
  useSocket("created_notification", (notification) => {
    setNotifications([...notifications, notification]);
  });
  useSocket("delete_notification", (notfId) => {
    setNotifications(notifications.filter((el) => el.id !== notfId));
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
