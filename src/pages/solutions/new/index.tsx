import {
  DifficultyRatingOption,
  PastPaper,
  Subject,
  SubjectTopic,
} from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import superjson from "superjson";
import NewSolutionForm from "../../../components/solution/NewSolutionForm";
import PageHeader from "../../../components/ui/PageHeader";
import { createContextInner } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/router/_app";

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

  const difficultyRatingOptions =
    await ssg.difficultyRatingOption.getAll.fetch();

  return {
    props: {
      subjectTopics,
      subjects,
      pastPapers,
      difficultyRatingOptions,
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type NewSolutionPageProps = {
  subjectTopics: SubjectTopic[];
  subjects: Subject[];
  pastPapers: PastPaper[];
  difficultyRatingOptions: DifficultyRatingOption[];
};

const NewSolutionPage: NextPage<NewSolutionPageProps> = (props) => {
  const { subjectTopics, subjects, pastPapers, difficultyRatingOptions } =
    props;

  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") return <h1>Loading...</h1>;

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Submit Solution" />
      </div>

      <NewSolutionForm
        subjectTopics={subjectTopics}
        subjects={subjects}
        pastPapers={pastPapers}
        difficultyRatingOptions={difficultyRatingOptions}
      />
    </div>
  );
};

export default NewSolutionPage;
