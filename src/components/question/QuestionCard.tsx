import { AiOutlineSolution } from "react-icons/ai";
import { GetAllQuestionsByPastPaperResponse } from "../../types/question";
import DifficultyLevelChip from "../ui/DifficultyLevelChip";

type QuestionCardProps = {
  question: GetAllQuestionsByPastPaperResponse[number];
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
              className="rounded-full bg-primary-default py-1 px-3 text-xs text-onPrimary"
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
