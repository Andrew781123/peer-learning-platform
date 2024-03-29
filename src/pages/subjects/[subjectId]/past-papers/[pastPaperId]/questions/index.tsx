import { PrismaClient } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import superjson from "superjson";

import QuestionCard from "@/components/question/QuestionCard";
import List from "@/components/ui/List";
import PageHeader from "@/components/ui/PageHeader";
import { createContextInner } from "@/server/trpc/context";
import { appRouter } from "@/server/trpc/router/_app";
import { trpc } from "@/utils/trpc";

interface IParams extends ParsedUrlQuery {
  pastPaperId: string;
}

export const getStaticPaths: GetStaticPaths<IParams> = async () => {
  const prisma = new PrismaClient();

  const subjects = await prisma.subject.findMany({
    include: {
      pastPapers: true,
    },
  });

  const paths = subjects.flatMap((subject) =>
    subject.pastPapers.map((pastPaper) => ({
      params: { pastPaperId: pastPaper.id.toString(), subjectId: subject.id },
    }))
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  QuestionPageProps,
  IParams
> = async (context: GetStaticPropsContext<IParams>) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  const params = context.params;

  if (params === undefined) return { notFound: true };

  await ssg.question.getAllByPastPaper.prefetch({
    pastPaperId: +params.pastPaperId,
  });

  const pastPaper = await ssg.pastPaper.getOne.fetch({
    id: +params.pastPaperId,
  });

  if (!pastPaper) return { notFound: true };

  return {
    props: {
      pastPaperId: +params.pastPaperId,
      pastPaperLink: pastPaper.link,
      trpcState: ssg.dehydrate(),
    },
    revalidate: 5 * 60,
  };
};

type QuestionPageProps = {
  pastPaperId: number;
  pastPaperLink: string;
};

const QuestionPage: NextPage<QuestionPageProps> = (props) => {
  const { pastPaperLink, pastPaperId } = props;

  const { data: getAllQuestionsByPastPaperResponse, isSuccess } =
    trpc.question.getAllByPastPaper.useQuery({
      pastPaperId,
    });

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Questions" />
      </div>
      <div className="mb-2 text-primary-light underline">
        <Link href={pastPaperLink} target="_blank" rel="noreferrer">
          Link to exam Paper
        </Link>
      </div>

      <List emptyMessage="No submissions for this exam paper yet">
        {isSuccess &&
          getAllQuestionsByPastPaperResponse.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
      </List>
    </div>
  );
};

export default QuestionPage;
