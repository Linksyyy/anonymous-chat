import { ImExit } from "react-icons/im";
import { useActualUserProvider } from "../Contexts/ActualUserProvider";
import { useRouter } from "next/navigation";

export default function UserMenu({ toggleVisible }) {
  const actualUserManager = useActualUserProvider();
  const router = useRouter();

  async function handleLogout() {
    router.push("/");
    await fetch("/api/logout", { method: "POST" });
    localStorage.setItem("actualUser", "")
  }
  return (
    <div onClick={toggleVisible} className="fixed inset-0 z-40">
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-12 left-10 bg-primary-1 rounded-bl-none rounded-4xl shadow-lg w-50 ring-1 ring-primary-2"
      >
        <button
          onClick={handleLogout}
          className="flex p-2 group items-center px-5 w-full rounded-4xl hover:bg-primary-2 cursor-pointer gap-4"
        >
          <ImExit className="text-red-700 group-hover:text-red-500" /> Logout
        </button>
      </div>
    </div>
  );
}
