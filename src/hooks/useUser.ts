import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return {
      user: session.user,
    };
  }

  return {
    user: null,
  };
};
