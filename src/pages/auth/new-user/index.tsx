import { captureException } from "@sentry/nextjs";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { trpc } from "../../../utils/trpc";

type NewUserPageProps = {};

const NewUserPage: NextPage<NewUserPageProps> = (props) => {
  const {} = props;

  const { status } = useSession();

  const router = useRouter();

  const trpcUtils = trpc.useContext();

  // ! This is a hacky way to get the callbackUrl from the query string
  // const callbackUrl = useMemo(() => {
  //   if (!router.query?.callbackUrl) return null;
  //   return (router.query.callbackUrl as string).split("?")[1]!.split("=")[1]!;
  // }, [router]);

  const { data: user } = trpc.auth.getMe.useQuery();

  const patchUserMutation = trpc.user.patchNewUser.useMutation({
    onSuccess: () => {
      trpcUtils.auth.getMe.invalidate();

      // ! This is a hacky way to trigger the useSession hook to update
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);

      // if (callbackUrl) return router.replace(decodeURIComponent(callbackUrl));
      return router.push("/subjects");
    },
    onError: (err) => {
      captureException(err);
      router.push("/subjects");
    },
  });

  useEffect(() => {
    if (!user || user?.name) return;

    const { id, email } = user;

    patchUserMutation.mutate({
      userId: id,
      email: email!,
    });
  }, [user]);

  if (status === "authenticated") router.push("/subjects");

  return <h1 className="text-2xl">Redirecting...</h1>;
};

export default NewUserPage;
