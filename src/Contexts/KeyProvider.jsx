"use client";
import { createContext, useState } from "react";

export const keyContext = createContext();

export default function KeyProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [key, setKey] = useState(null);
  const ctx = { key, setKey, userId, setUserId };
  return <keyContext.Provider value={ctx}>{children}</keyContext.Provider>;
}
