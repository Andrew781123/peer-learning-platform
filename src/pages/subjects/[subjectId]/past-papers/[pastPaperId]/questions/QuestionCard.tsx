import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../../../../server/trpc/router/_app";

type QuestionCardProps = {
  question: inferProcedureOutput<
    AppRouter["question"]["getAllByPastPaper"]
  >[number];
};

const QuestionCard = (props: QuestionCardProps) => {
  const { question } = props;

  return (
    <div className="flex items-center  bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light">
      <p>Question {question.number}</p>
    </div>
  );
};

export default QuestionCard;
