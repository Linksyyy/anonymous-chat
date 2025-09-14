import ChatsList from "../../Components/ChatsList";

export default function LoungeLayout({ children }) {
  return (
    <section className="fixed inset-0 bg-primary flex">
      <ChatsList />
      <main className="h-full flex-1">{children}</main>
    </section>
  );
}
