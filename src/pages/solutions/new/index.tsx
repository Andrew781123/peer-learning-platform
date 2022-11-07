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

  const subjectTopics = trpc.subjectTopic.getAllBySubject.useQuery({
    subjectId: "EIE3112",
  });

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Submit Solution" />
      </div>

      <NewSolutionForm subjectTopics={subjectTopics.data ?? []} />
    </div>
  );
};

export default NewSolutionPage;
