import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const onLogoClick = () => {
    router.push("/subjects");
  };

  return (
    <nav className="flex items-center gap-10 bg-surface-default p-5 text-onSurface ">
      <div className="" onClick={onLogoClick}>
        <p className="text-lg font-bold hover:cursor-pointer">
          Peer Learning Platform
        </p>
      </div>

      <ul className="flex gap-7">
        <li className="hover:cursor-pointer">Create</li>
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
        ) : (
          <>
            <li className="hover:cursor-default">{session?.user?.name}</li>
            <li className="hover:cursor-pointer" onClick={() => signOut()}>
              Sign out
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
