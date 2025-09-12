import ChatList from "../../Components/ChatsList";

export default function LoungeLayout({ children }) {
  return (
    <section className="fixed inset-0 bg-primary">
      <ChatList Chats={[{ name: "teste" }, { name: "teste" }]} />
      {children}
    </section>
  );
}
