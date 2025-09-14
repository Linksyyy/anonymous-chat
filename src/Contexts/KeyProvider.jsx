"use client";
import { createContext, useContext, useState } from "react";

const keyContext = createContext();

export function KeyProvider({ children }) {
  const [key, setKey] = useState(null);
  const ctx = { key, setKey };
  return <keyContext.Provider value={ctx}>{children}</keyContext.Provider>;
}

export function useKeyProvider() {
  return useContext(keyContext);
}
