import { createProxySSGHelpers } from "@trpc/react/ssg";
import { GetStaticProps, NextPage } from "next";
import superjson from "superjson";
import NewSolutionForm from "../../../components/solution/NewSolutionForm";
import PageHeader from "../../../components/ui/PageHeader";
import { createContextInner } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/router/_app";
import { trpc } from "../../../utils/trpc";

export const getStaticProps: GetStaticProps<
  NewSolutionPageProps
> = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  await ssg.subjectTopic.getAllBySubject.prefetch({ subjectId: "EIE3112" });

  await ssg.subject.getAll.prefetch();

  await ssg.pastPaper.getAllBySubject.prefetch({ subjectId: "EIE3112" });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type NewSolutionPageProps = {};

const NewSolutionPage: NextPage<NewSolutionPageProps> = (props) => {
  const {} = props;

  const subjectTopic = trpc.subjectTopic.getAllBySubject.useQuery({
    subjectId: "EIE3112",
  });
  const subject = trpc.subject.getAll.useQuery();
  const pastPaper = trpc.pastPaper.getAllBySubject.useQuery({
    subjectId: "EIE3112",
  });

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Submit Solution" />
      </div>

      {subjectTopic.isLoading || subject.isLoading || pastPaper.isLoading ? (
        <div>Loading...</div>
      ) : (
        <NewSolutionForm
          // TODO - fix this
          subjectTopics={subjectTopic.data ?? []}
          subjects={subject.data!}
          pastPapers={pastPaper.data!}
        />
      )}
    </div>
  );
};

export default NewSolutionPage;
