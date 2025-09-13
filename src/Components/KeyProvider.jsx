"use client";
import { createContext, useEffect, useState } from "react";

export const keyContext = createContext();

export default function KeyProvider({ children }) {
  const [key, setKey] = useState(null);
  const ctx = { key, setKey };
  useEffect(() => {
    console.log(key)
  }, [key])
  return <keyContext.Provider value={ctx}>{children}</keyContext.Provider>;
}
