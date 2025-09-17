"use client";

export default function Notifications({ toggleVisible, notifications }) {
  return (
    <div onClick={toggleVisible} className="fixed inset-0 z-10">
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-12 left-10 bg-primary-1 rounded-tl-none rounded-4xl shadow-lg w-80 ring-1 ring-primary-2"
      >
        <div className="p-4 border-b border-primary-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="p-4">
          {notifications && notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <li key={index} className="p-2 rounded-lg hover:bg-primary-2">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-gray-400">
                    {notification.message}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No new notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}