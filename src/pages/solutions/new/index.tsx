import { createProxySSGHelpers } from "@trpc/react/ssg";
import { GetStaticProps, NextPage } from "next";
import superjson from "superjson";
import NewSolutionForm from "../../../components/solution/NewSolutionForm";
import PageHeader from "../../../components/ui/PageHeader";
import { createContextInner } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/router/_app";
import { PastPaper } from "../../../types/past-papers";
import { Subject, SubjectTopic } from "../../../types/subject";

export const getStaticProps: GetStaticProps<
  NewSolutionPageProps
> = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  const subjectTopics = await ssg.subjectTopic.getAllBySubject.fetch({
    subjectId: "EIE3112",
  });

  const subjects = await ssg.subject.getAll.fetch();

  const pastPapers = await ssg.pastPaper.getAllBySubject.fetch({
    subjectId: "EIE3112",
  });

  return {
    props: {
      subjectTopics,
      subjects,
      pastPapers,
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type NewSolutionPageProps = {
  subjectTopics: SubjectTopic[];
  subjects: Subject[];
  pastPapers: PastPaper[];
};

const NewSolutionPage: NextPage<NewSolutionPageProps> = (props) => {
  const { subjectTopics, subjects, pastPapers } = props;

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Submit Solution" />
      </div>

      <NewSolutionForm
        subjectTopics={subjectTopics}
        subjects={subjects}
        pastPapers={pastPapers}
      />
    </div>
  );
};

export default NewSolutionPage;
