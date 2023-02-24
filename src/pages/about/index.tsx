import Divider from "@/components/ui/Divider";
import Section from "@/components/ui/Section";

const LINKS = [
  {
    text: "Pre-survey",
    href: "https://forms.gle/yaLq2HLnApa63QiC7",
  },
  {
    text: "Post-survey",
    href: "https://forms.gle/MxbURd72zFJNCYXD9",
  },
];

const AboutPage = () => {
  return (
    <div className="m-auto flex h-full flex-col items-center justify-center md:w-full lg:w-3/4">
      <Section className="p-6">
        <h2 className="md-1 text-xl font-bold">
          Thanks for participating the evaluation.
        </h2>
        <Divider className="my-2" />
        <p className="text-lg text-gray-400">
          You can find the links to the surveys and bug report here.
        </p>
        <div className="mt-2 flex flex-col items-start space-y-2">
          <h3 className="text-lg font-bold text-gray-200">Surveys</h3>
          <Divider />
          {LINKS.map(({ text, href }, i) => (
            <a
              key={i}
              href={href}
              className="cursor-pointer text-primary-default hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {text}
            </a>
          ))}
        </div>

        <div className="flex flex-col space-y-2 mt-5">
          <h3 className="text-lg font-bold text-gray-200">
            Bug Report / Other enquiry & discussion
          </h3>
          <Divider />
          <span>Please send an email to </span>
          <a
            href="mailto:andrew@exampeer.app"
            className="cursor-pointer text-primary-default hover:underline"
          >
            andrew@exampeer.app
          </a>
        </div>
      </Section>
    </div>
  );
};

export default AboutPage;
