import { createProxySSGHelpers } from "@trpc/react/ssg";
import { NextPage } from "next";
import superjson from "superjson";
import SubjectCard from "../../components/subject/SubjectCard";
import PageHeader from "../../components/ui/PageHeader";
import { createContextInner } from "../../server/trpc/context";
import { appRouter } from "../../server/trpc/router/_app";
import { trpc } from "../../utils/trpc";

export const getStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  await ssg.subject.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type SubjectPageProps = {};

const SubjectPage: NextPage = (props: SubjectPageProps) => {
  const {} = props;

  const subjects = trpc.subject.getAll.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  console.log(123123, subjects.data);

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Subjects" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {subjects.data?.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default SubjectPage;
