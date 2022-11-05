import { inferProcedureOutput } from "@trpc/server";
import { AiOutlineSolution } from "react-icons/ai";
import { AppRouter } from "../../server/trpc/router/_app";
import DifficultyLevelChip from "../ui/DifficultyLevelChip";

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

      <div className="flex items-center gap-5">
        <DifficultyLevelChip level={question.difficultyLevel} />
        <div className="flex items-center gap-1">
          <AiOutlineSolution />
          <p>{question.solutionCount}</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
