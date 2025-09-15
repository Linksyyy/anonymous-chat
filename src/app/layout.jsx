import "../index.css";
import { KeyProvider } from "../Contexts/KeyProvider";
import { ActualUserProvider } from "../Contexts/ActualUserProvider";
import { ActualOpenedChatProvider } from "../Contexts/ActualOpenedChatProvider";

export default function RootLayout({ children }) {
  return (
    <>
      <head>
        <title>Anonymous Chat</title>
      </head>
      <html className="h-full">
        <body className="h-full bg-primary text-white">
          <KeyProvider>
            <ActualUserProvider>
              <ActualOpenedChatProvider>{children}</ActualOpenedChatProvider>
            </ActualUserProvider>
          </KeyProvider>
        </body>
      </html>
    </>
  );
}
