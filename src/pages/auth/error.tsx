import { captureMessage } from "@sentry/nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Divider from "@/components/ui/Divider";
import Section from "@/components/ui/Section";

const ErrorPage: NextPage = () => {
  const { query } = useRouter();

  useEffect(() => {
    if (!query?.error) return;

    captureMessage(query?.error as string);
  }, [query]);

  return (
    <div className="m-auto flex h-full flex-col items-center justify-center w-full sm:w-1/2 max-w-md">
      <Section className="p-6">
        <h2 className="md-1 text-xl font-bold text-center">Error</h2>
        <Divider className="my-2" />

        <p className="text-center">
          Error during authentication, please try again or send a bug report to{" "}
          <a
            href="mailto:andrew@exampeer.app"
            className="cursor-pointer text-primary-default hover:underline"
          >
            andrew@exampeer.app
          </a>
        </p>
      </Section>
    </div>
  );
};

export default ErrorPage;
