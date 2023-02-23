import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";

import { useUser } from "@/hooks/useUser";

const FaUserAlt = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaUserAlt),
  { ssr: false }
);

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user } = useUser();

  const onLogoClick = () => {
    router.push("/subjects");
  };

  return (
    <nav className="flex w-full items-center gap-10 bg-surface-default p-5 text-onSurface">
      <div className="" onClick={onLogoClick}>
        <p className="text-2xl font-bold hover:cursor-pointer text-primary-default">
          ExamPeer
        </p>
      </div>

      <ul className="flex gap-7">
        <Link href="/solutions/new">
          <li className="hover:cursor-pointer">Create</li>
        </Link>
        <Link href="/about">
          <li className="hover:cursor-pointer">About</li>
        </Link>
      </ul>

      <ul className="ml-auto mr-2 flex gap-7">
        {status === "unauthenticated" ? (
          <>
            <li className="hover:cursor-pointer" onClick={() => signIn()}>
              Sign in
            </li>
          </>
        ) : status === "authenticated" ? (
          <>
            <div className="text-primary-dark flex items-center space-x-1">
              <FaUserAlt />
              <span className="hover:cursor-default">{user?.name}</span>
            </div>

            <li className="hover:cursor-pointer" onClick={() => signOut()}>
              Sign out
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
};

export default Navbar;
