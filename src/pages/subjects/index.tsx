import { createProxySSGHelpers } from "@trpc/react/ssg";
import { GetStaticProps, NextPage } from "next";
import superjson from "superjson";

import SubjectCard from "../../components/subject/SubjectCard";
import Divider from "../../components/ui/Divider";
import PageHeader from "../../components/ui/PageHeader";
import { createContextInner } from "../../server/trpc/context";
import { appRouter } from "../../server/trpc/router/_app";
import { trpc } from "../../utils/trpc";

export const getStaticProps: GetStaticProps<SubjectPageProps> = async () => {
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

const SubjectPage: NextPage<SubjectPageProps> = (props) => {
  const { data: getAllSubjectResponse, isSuccess } =
    trpc.subject.getAll.useQuery();

  return (
    <div className="">
      <div>
        <PageHeader title="Subjects" />
        <Divider />
      </div>

      {isSuccess && (
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {getAllSubjectResponse.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectPage;
