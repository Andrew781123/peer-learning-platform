import Link from "next/link";
import Divider from "../../components/ui/Divider";
import Section from "../../components/ui/Section";

const AboutPage = () => {
  return (
    <div className="m-auto flex h-full flex-col items-center justify-center md:w-full lg:w-3/4">
      <Section className="p-6">
        <h3 className="md-1 text-center text-xl font-bold">
          Thanks for participating the evaluation.
        </h3>
        <Divider className="my-2" />
        <p className="text-center text-lg text-gray-300">
          You can find the links to the evaluation forms and bug report here.
        </p>
        <div className="mt-2 flex flex-col items-center">
          <Link
            href="https://forms.gle/yaLq2HLnApa63QiC7"
            className="cursor-pointer text-primary-default hover:underline"
          >
            Pre-evaluation Form
          </Link>
          <Link
            href="https://forms.gle/MxbURd72zFJNCYXD9"
            className="cursor-pointer text-primary-default hover:underline"
          >
            Post-evaluation Form
          </Link>
          <Link
            href="https://forms.gle/ATPeArME6hzzCAuU8"
            className="cursor-pointer text-primary-default hover:underline"
          >
            Bug Report
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default AboutPage;
