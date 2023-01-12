import { useRouter } from "next/router";
import { AiOutlineSolution } from "react-icons/ai";
import { GetAllQuestionsByPastPaperResponse } from "../../types/question";
import TopicBadge from "../topic/TopicBadge";
import DifficultyLevelChip from "../ui/DifficultyLevelChip";

type QuestionCardProps = {
  question: GetAllQuestionsByPastPaperResponse[number];
};

const QuestionCard = (props: QuestionCardProps) => {
  const { question } = props;

  const router = useRouter();

  const onQuestionCardClick = () => {
    router.push(`/questions/${question.id}/solutions`);
  };

  return (
    <div
      onClick={onQuestionCardClick}
      className="flex items-center  justify-between bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light"
    >
      <div className="max-w-[50%]">
        <p className="mb-1">Question {question.number}</p>
        <div className="flex  flex-wrap gap-2">
          {question.topics.map((topic) => (
            <TopicBadge key={topic} topic={topic} />
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
