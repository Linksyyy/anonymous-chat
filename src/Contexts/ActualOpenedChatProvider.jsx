"use client";
import { createContext, useContext, useState } from "react";

const ActualOpenedContext = createContext();

export function ActualOpenedChatProvider({ children }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");

  const ctx = { id, setId, username, setUsername };
  return (
    <ActualOpenedContext.Provider value={ctx}>
      {children}
    </ActualOpenedContext.Provider>
  );
}

export function useActualOpenedChatProvider() {
  return useContext(ActualOpenedContext);
}
