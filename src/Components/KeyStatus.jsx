import { useEffect, useState } from "react";
import { useKeyProvider } from "../Contexts/KeyProvider";
import { FiCheck, FiX } from "react-icons/fi";
import { useActualUserProvider } from "../Contexts/ActualUserProvider";

export default function KeyStatus({ toggleVisible }) {
  const [keys, setKeys] = useState(new Map());

  const keyManager = useKeyProvider();
  const actualUserManager = useActualUserProvider();

  useEffect(() => {
    const fetchChatData = async () => {
      setKeys(keyManager.groupKeys);
    };

    if (keyManager.groupKeys.size > 0) {
      fetchChatData();
    }
  }, [keyManager.groupKeys]);

  return (
    <div onClick={toggleVisible} className="fixed inset-0 z-10">
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-12 left-45 bg-primary-1 rounded-tl-none rounded-4xl shadow-lg w-120 ring-1 ring-primary-2"
      >
        <div className="p-4 border-b border-primary-2">
          <h2 className="text-lg font-semibold">Keys Manager</h2>
        </div>
        <div>
          {actualUserManager.chats.map((chat) => (
            <div
              key={chat.id}
              className="px-6 flex justify-between border-primary-2 border-t-2"
            >
              <h2 className="text-xl h-10">{chat.title}</h2>
              {keys?.get(chat.id) ? (
                <FiCheck className="size-8 text-green-600" />
              ) : (
                <FiX className="size-8 text-red-800" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
