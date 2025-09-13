import "../index.css";
import KeyProvider from "../Components/KeyProvider";

export default function RootLayout({ children }) {
  return (
    <html className="h-full">
      <body className="h-full bg-primary text-white">
        <KeyProvider>{children}</KeyProvider>
      </body>
    </html>
  );
}
