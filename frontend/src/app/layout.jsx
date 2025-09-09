import "../index.css"

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="bg-primary text-white">
        {children}
      </body>
    </html>
  );
}
