"use client";
import { createContext, useContext, useState } from "react";

const ActualUserContext = createContext();

export function ActualUserProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  const ctx = { id, setId, username, setUsername };
  return (
    <ActualUserContext.Provider value={ctx}>
      {children}
    </ActualUserContext.Provider>
  );
}

export function useActualUserProvider() {
  return useContext(ActualUserContext);
}
