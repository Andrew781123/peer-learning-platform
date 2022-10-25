import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  const onLogoClick = () => {
    router.push("/subjects");
  };

  return (
    <nav className="flex items-center gap-10 bg-surface-default p-5 text-onSurface hover:cursor-pointer">
      <div className="" onClick={onLogoClick}>
        <p className="text-lg font-bold">Peer Learning Platform</p>
      </div>

      <ul className="flex gap-7">
        <li>Create</li>
        <li>About</li>
      </ul>

      <ul className="ml-auto mr-2 flex gap-7">
        <li className="">Sign in</li>
        <li className="">Sign up</li>
      </ul>
    </nav>
  );
};

export default Navbar;
