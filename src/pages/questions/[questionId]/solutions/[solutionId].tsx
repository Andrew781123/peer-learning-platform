import { PrismaClient } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { ParsedUrlQuery } from "querystring";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import superjson from "superjson";

import { MarkdownImage } from "@/components/solution/MarkdownImage";
import Divider from "@/components/ui/Divider";
import PageHeader from "@/components/ui/PageHeader";
import { SolutionCommentSection } from "@/features/solution/components/solutionDetail/SolutionCommentSection";
import { SolutionInfo } from "@/features/solution/components/solutionDetail/SolutionInfo";
import { SolutionVote } from "@/features/solution/components/solutionDetail/SolutionVote";
import { createContextInner } from "@/server/trpc/context";
import { appRouter } from "@/server/trpc/router/_app";
import generateSolutionTitle from "@/utils/solution/generate-solution-title";
import { trpc } from "@/utils/trpc";

type PastPaperPageProps = {
  solutionId: string;
  questionId: string;
  questionNumber: number;
};

const PastPaperPage: NextPage<PastPaperPageProps> = (props) => {
  const { solutionId, questionId, questionNumber } = props;

  const solution = trpc.solution.getOneById.useQuery({
    id: solutionId,
  });

  const solutionName = generateSolutionTitle(solutionId);

  if (!solution.isSuccess) return null;

  return (
    <div className="">
      <div>
        <PageHeader
          title={`Solution of Question ${questionNumber}`}
          className="mb-0"
        />

        <SolutionInfo
          solutionName={solutionName}
          authorId={solution.data.userId}
          createdAt={solution.data.createdAt}
        />
        <Divider className="mt-2" />
      </div>

      <div className="flex w-full gap-4">
        <div className="mt-2">
          <SolutionVote
            solutionId={solutionId}
            questionId={questionId}
            fallbackVoteCount={solution.data.votes}
          />
        </div>

        <div className="mt-2 w-full">
          <div className="min-h-[8rem]">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ src, alt }) => <MarkdownImage src={src!} alt={alt!} />,
              }}
              className="prose dark:prose-invert"
            >
              {solution.data.markdown.replace(/\n/, "  \n")}
            </ReactMarkdown>
          </div>

          <Divider className="mt-5" />

          <SolutionCommentSection />
        </div>
      </div>
    </div>
  );
};

export default PastPaperPage;

interface IParams extends ParsedUrlQuery {
  solutionId: string;
  questionId: string;
}

export const getStaticPaths: GetStaticPaths<IParams> = async () => {
  const prisma = new PrismaClient();

  const questionSolutions = await prisma.questionSolution.findMany();

  const paths = questionSolutions.map(({ questionId, solutionId }) => ({
    params: { solutionId, questionId },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  PastPaperPageProps,
  IParams
> = async (context: GetStaticPropsContext<IParams>) => {
  const prisma = new PrismaClient();

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  const params = context.params;

  if (params === undefined) return { notFound: true };

  const solution = await ssg.solution.getOneById.fetch({
    id: params.solutionId,
  });

  if (!solution) return { notFound: true };

  const question = await prisma.question.findUnique({
    where: { id: params.questionId },
  });

  if (!question) return { notFound: true };

  return {
    props: {
      solutionId: params.solutionId,
      questionId: params.questionId,
      questionNumber: question.number,
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};
