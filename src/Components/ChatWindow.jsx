export default function ChatWindow({ messages }) {
  return (
    <main className="h-full overflow-y-auto min-h-0 flex flex-col">
      <header className="h-12 px-5 bg-secondary text-2xl items-center flex">
        teste
      </header>
      <div className="flex-col-reverse flex-1 flex overflow-y-auto">
        {messages.map((message) => (
          <h1>{message}</h1>
        ))}
      </div>
      <footer className="h-12 items-center flex">
        <form className="w-full justify-evenly flex bg-tertiary h-10 m-5 gap-20 rounded-4xl">
          <input type="text" className="bg-tertiary ml-5 w-full outline-0" />
          <button type="submit" className="mr-5">
            Send
          </button>
        </form>
      </footer>
    </main>
  );
}
