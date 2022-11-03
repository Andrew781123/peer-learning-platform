import { PrismaClient } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { ParsedUrlQuery } from "querystring";
import superjson from "superjson";
import List from "../../../../../../components/ui/List";
import PageHeader from "../../../../../../components/ui/PageHeader";
import { createContextInner } from "../../../../../../server/trpc/context";
import { appRouter } from "../../../../../../server/trpc/router/_app";
import { trpc } from "../../../../../../utils/trpc";
import QuestionCard from "./QuestionCard";

interface IParams extends ParsedUrlQuery {
  pastPaperId: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
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

export const getStaticProps: GetStaticProps<QuestionPageProps> = async (
  context: GetStaticPropsContext
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  const params = context.params as IParams;

  await ssg.question.getAllByPastPaper.prefetch({
    pastPaperId: +params.pastPaperId,
  });

  const pastPaper = await ssg.pastPaper.getOne.fetch({
    id: +params.pastPaperId,
  });

  return {
    props: {
      pastPaperId: params.pastPaperId,
      pastPaperLink: pastPaper!.link,
      trpcState: ssg.dehydrate(),
    },
    revalidate: 5 * 60,
  };
};

type QuestionPageProps = {
  pastPaperId: string;
  pastPaperLink: string;
};

const QuestionPage: NextPage<QuestionPageProps> = (props) => {
  const { pastPaperId, pastPaperLink } = props;

  const questions = trpc.question.getAllByPastPaper.useQuery({
    pastPaperId: +pastPaperId,
  });

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Questions" />
      </div>
      <p className="mb-2">
        Link to exam paper:{" "}
        <a href={pastPaperLink} target="_blank" className="underline">
          {pastPaperLink}
        </a>
      </p>

      <List>
        {questions.data?.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </List>
    </div>
  );
};

export default QuestionPage;
