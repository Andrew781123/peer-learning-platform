import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useLayoutEffect } from "react";

const Home: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const router = useRouter();

  useLayoutEffect(() => {
    router.push("/subjects");
  }, []);

  return null;
};

export default Home;
