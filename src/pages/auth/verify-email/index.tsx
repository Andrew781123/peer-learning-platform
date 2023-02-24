import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

import Section from "../../../components/ui/Section";

export const getServerSideProps: GetServerSideProps<
  EmailVerificationPageProps
> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

type EmailVerificationPageProps = {};

const EmailVerificationPage: NextPage<EmailVerificationPageProps> = ({}) => {
  const router = useRouter();

  return (
    <div className="flex h-1/2 items-center justify-center">
      <Section className="flex h-4/5 flex-col justify-around p-8 text-center">
        <div>
          <h1 className="mb-2 text-3xl">Check your email</h1>
          <p className="text-lg text-gray-200">
            A sign in link has been sent to your email address.
          </p>
          <p className="text-lg text-gray-200">
            Also check the spam mails if your can&#39;t find the verification
            email
          </p>
        </div>
      </Section>
    </div>
  );
};

export default EmailVerificationPage;
