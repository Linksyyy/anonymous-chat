export default function CreateChatForm({ toggleVisible }) {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
      <form className="bg-primary flex flex-col p-5 rounded-4xl gap-5 px-15">
        <h1 className="justify-center flex w-full text-2xl font-bold">
          Create chat
        </h1>
        <label>Name new chat</label>
        <input autoFocus type="text" className="bg-secondary rounded-2xl p-1 outline-none px-5" />

        <div className="w-full flex justify-evenly gap-4">
          <button
            onClick={toggleVisible}
            className="bg-neutral-900 hover:bg-neutral-950 py-1 px-3 rounded-2xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-800 hover:bg-green-950 py-1 px-3 rounded-2xl"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
