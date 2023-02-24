import { PrismaClient } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import clsx from "clsx";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import { toast } from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import superjson from "superjson";

import { MarkdownImage } from "@/components/solution/MarkdownImage";
import Divider from "@/components/ui/Divider";
import PageHeader from "@/components/ui/PageHeader";
import VoteIcon from "@/components/vote/VoteIcon";
import { SolutionVote } from "@/features/solution/components/solutionDetail/SolutionVote";
import { useUser } from "@/hooks/useUser";
import { createContextInner } from "@/server/trpc/context";
import { appRouter } from "@/server/trpc/router/_app";
import { getTimeFromX } from "@/server/utils/dates";
import { SOLUTION_VOTE_VALUE, SolutionVoteValue } from "@/types/solution-vote";
import generateSolutionTitle from "@/utils/solution/generate-solution-title";
import { trpc } from "@/utils/trpc";

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

type PastPaperPageProps = {
  solutionId: string;
  questionId: string;
  questionNumber: number;
};

const PastPaperPage: NextPage<PastPaperPageProps> = (props) => {
  const { solutionId, questionId, questionNumber } = props;

  const { user } = useUser();

  const solution = trpc.solution.getOneById.useQuery({
    id: solutionId,
  });

  const title = generateSolutionTitle(solutionId);

  if (!solution.isSuccess) return null;

  return (
    <div className="">
      <div>
        <PageHeader
          title={`Solution of Question ${questionNumber}`}
          className="mb-0"
        />

        <p className="text-gray-400">
          from <span className="text-gray-300">{title}</span>
        </p>

        <p className="text-gray-400">
          posted{" "}
          <span className="text-gray-300">
            {getTimeFromX({ toDate: new Date(solution.data.createdAt) })}
          </span>
        </p>

        <div
          className={clsx(
            user?.id !== solution.data.user.id && "hidden",
            "flex items-center space-x-1 text-yellow-300"
          )}
        >
          <FaUserAlt />
          <span>You are the </span>
          <span>Author</span>
        </div>
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
      </div>
    </div>
  );
};

export default PastPaperPage;
