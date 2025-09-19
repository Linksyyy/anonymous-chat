export default function ChatInfo({ chat, toggleVisible }) {
  const date = new Date(Date.parse(chat.created_at));
  return (
    <div
      onClick={toggleVisible}
      className="fixed inset-0 bg-secondary-0/16 flex items-center justify-center z-1"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="bg-primary-0 flex flex-col p-5 rounded-4xl gap-5 px-15 max-w-lg w-full ring-1 ring-primary-2"
      >
        <header>
          <h1 className="text-2xl font-bold">Chat info</h1>
        </header>

        <dl className="space-y-2">
          <dt className="font-semibold">Title:</dt>
          <dd className="bg-primary-1 rounded-xl p-2 break-words">
            {chat.title}
          </dd>
        </dl>

        <dl className="space-y-2">
          <dt className="font-semibold">Created at:</dt>
          <dd className="bg-primary-1 rounded-xl p-2">
            {date.toLocaleString("pt-BR")}
          </dd>
        </dl>

        <section className="bg-primary-1 rounded-2xl p-5">
          <h2 className="text-xl font-bold mb-3">Participants:</h2>
          <ul className="space-y-3">
            {chat.participants.map((participant, index) => (
              <li
                key={index}
                className="bg-primary-2 p-3 rounded-2xl text-sm flex justify-between items-center"
              >
                <span>{participant.user.username}</span>
                {participant.role && (
                  <span className="text-xs opacity-75">{participant.role}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
        <button
          type="button"
          onClick={toggleVisible}
          className="bg-neutral-900 hover:bg-neutral-950 py-1 px-3 rounded-2xl"
        >
          Back
        </button>
      </section>
    </div>
  );
}
