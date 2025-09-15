"use client";
import { createContext, useContext, useState } from "react";

const ActualOpenedContext = createContext();

export function ActualOpenedChatProvider({ children }) {
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");

  const ctx = { id, setId, title, setTitle };
  return (
    <ActualOpenedContext.Provider value={ctx}>
      {children}
    </ActualOpenedContext.Provider>
  );
}

export function useActualOpenedChatProvider() {
  return useContext(ActualOpenedContext);
}
