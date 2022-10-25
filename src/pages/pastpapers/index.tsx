import { createProxySSGHelpers } from "@trpc/react/ssg";
import { GetStaticPropsContext } from "next";
import superjson from "superjson";
import PageHeader from "../../components/ui/PageHeader";
import { createContextInner } from "../../server/trpc/context";
import { appRouter } from "../../server/trpc/router/_app";
import { trpc } from "../../utils/trpc";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  await ssg.pastPaper.getAllBySubject.prefetch({ subjectId: "EIE3112" });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type PastPaperPageProps = {};

const PastPaperPage = (props: PastPaperPageProps) => {
  const {} = props;

  const pastPapers = trpc.pastPaper.getAllBySubject.useQuery({
    subjectId: "EIE3112",
  });

  console.log({ data: pastPapers.data });

  return (
    <div>
      <PageHeader title="Past Papers" />
    </div>
  );
};

export default PastPaperPage;
