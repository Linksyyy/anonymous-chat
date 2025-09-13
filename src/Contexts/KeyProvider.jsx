"use client";
import { createContext, useState } from "react";

export const keyContext = createContext();

export default function KeyProvider({ children }) {
  const [key, setKey] = useState(null);
  const ctx = { key, setKey };
  return <keyContext.Provider value={ctx}>{children}</keyContext.Provider>;
}
