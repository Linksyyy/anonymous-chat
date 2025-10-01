"use client";
import "../index.css";
import { KeyProvider } from "../Contexts/KeyProvider";
import { ActualUserProvider } from "../Contexts/ActualUserProvider";
import { ActualOpenedChatProvider } from "../Contexts/ActualOpenedChatProvider";
import { useState } from "react";
import { useSocket } from "../lib/useSocket";

export default function RootLayout({ children }) {
  const [errorState, setErrorState] = useState(null);

  useSocket("feedback", ({ message, hasError }) => {
    setErrorState({ message, hasError });
    setTimeout(() => {
      setErrorState(null);
    }, 1500);
  });
  return (
    <>
      <head>
        <title>Anonymous Chat</title>
      </head>
      <html className="h-full">
        <body className="h-full bg-primary-0 text-white flex">
          <KeyProvider>
            <ActualUserProvider>
              <section className="flex w-full justify-center">
                <div
                  className={`fixed justify-center px-5 h-10 z-100 rounded-3xl flex items-center transition-transform transform duration-500 ease-in-out
                    ${errorState ? "translate-y-3" : "-translate-y-full"}
                    ${
                      errorState && errorState.hasError
                        ? "bg-red-600"
                        : "bg-green-600"
                    }`}
                >
                  {errorState && errorState.message}
                </div>
              </section>
              <ActualOpenedChatProvider>{children}</ActualOpenedChatProvider>
            </ActualUserProvider>
          </KeyProvider>
        </body>
      </html>
    </>
  );
}
