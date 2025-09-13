import "../index.css";

export default function RootLayout({ children }) {
  return (
    <html className="h-full">
      <body className="h-full bg-primary text-white">
        {children}
      </body>
    </html>
  );
}
