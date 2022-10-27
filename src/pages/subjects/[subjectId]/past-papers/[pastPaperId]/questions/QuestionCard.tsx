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
    <div className="flex items-center  justify-between bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light">
      <div className="max-w-[50%]">
        <p className="mb-1">Question {question.number}</p>
        <div className="flex  flex-wrap gap-2">
          {question.topics.map((topic) => (
            <p
              key={topic}
              className="rounded-lg bg-primary-default p-1 text-xs text-onPrimary"
            >
              {topic}
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <p>{question.difficultyRating}/5</p>
        <p>{question.solutionCount}</p>
      </div>
    </div>
  );
};

export default QuestionCard;
