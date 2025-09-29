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
    <div onClick={toggleVisible} className="fixed inset-0 z-40">
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-15 left-0 bg-primary-1 rounded-lg shadow-lg w-60 max-w-xs ring-1 ring-primary-2"
      >
        <div className="p-3 border-b border-primary-2 flex items-center justify-between">
          <h2 className="text-md font-semibold">Keys Manager</h2>
          <FiX
            onClick={toggleVisible}
            className="size-8 hover:text-neutral-500 cursor-pointer"
          />
        </div>
        <div className="p-2">
          {actualUserManager.chats.length === 0 ? (
            <div className="flex justify-center items-center p-4">
              <p className="text-gray-400 text-center text-sm">
                You aren't in any chat to have keys.
              </p>
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {actualUserManager.chats.map((chat) => (
                <li
                  key={chat.id}
                  className="px-4 py-2 flex justify-between items-center border-primary-2 not-last:border-b"
                >
                  <h2 className="text-lg truncate flex items-center">
                    {chat.title}
                  </h2>
                  {keys?.get(chat.id) ? (
                    <FiCheck className="size-6 text-green-500" />
                  ) : (
                    <FiX className="size-6 text-red-500" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
