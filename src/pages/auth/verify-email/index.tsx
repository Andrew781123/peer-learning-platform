import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Section from "../../../components/ui/Section";

export const getServerSideProps: GetServerSideProps<
  EmailVerificationPageProps
> = async (context) => {
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
        <p className="mb-0 text-gray-200">
          If you don&#39;t receive the email, click{" "}
          <span
            className="cursor-pointer self-end text-primary-default"
            onClick={() => router.back()}
          >
            here
          </span>
        </p>
      </Section>
    </div>
  );
};

export default EmailVerificationPage;
