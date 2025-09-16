import Link from "next/link";
import { MdLogin } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { SiHackthebox } from "react-icons/si";

export default function page() {
  return (
    <div className="inset-0 fixed justify-center items-center flex overflow-y-auto">
      <div className="bg-primary-1 w-full max-w-2xl space-y-30 p-20 rounded-4xl flex flex-col justify-evenly">
        <h1 className="justify-center items-center text-3xl font-extrabold flex gap-2">
          <SiHackthebox className="size-14" /> Welcome to anonymous chat!
        </h1>
        <p className="justify-center flex text-xl text-center">
          Connect with new people safely and privately.<br/>
          Let's get started?
        </p>

        <div className="flex justify-evenly gap-8 mt-10 overflow-x-auto">
          <Link href="/register">
            <button className="bg-blue-800 hover:bg-blue-700 gap-2 font-bold py-2 px-4 rounded flex items-center">
              Create account <FiPlus />
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-zinc-600 hover:bg-zinc-700 gap-2 font-bold py-2 px-4 rounded flex items-center">
              Enter with my account <MdLogin />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
