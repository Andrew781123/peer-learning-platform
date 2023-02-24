import clsx from "clsx";
import { useRouter } from "next/router";
import { AiOutlineSolution } from "react-icons/ai";
import { FaUserCheck } from "react-icons/fa";

import { trpc } from "@/utils/trpc";

import { GetAllQuestionsByPastPaperResponse } from "../../types/question";
import TopicBadge from "../topic/TopicBadge";
import DifficultyLevelChip from "../ui/DifficultyLevelChip";

type QuestionCardProps = {
  question: GetAllQuestionsByPastPaperResponse[number];
};

const QuestionCard = (props: QuestionCardProps) => {
  const { question } = props;

  const router = useRouter();

  const { data: mySolutionsCount = 0 } =
    trpc.question.getNumberOfSolutionOfQuestionByMe.useQuery({
      questionId: question.id,
    });

  const onQuestionCardClick = () => {
    router.push(`/questions/${question.id}/solutions`);
  };

  return (
    <div
      onClick={onQuestionCardClick}
      className="flex items-center  justify-between bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light"
    >
      <div className="max-w-[50%] flex flex-col space-y-1">
        <p>Question {question.number}</p>

        <div
          className={clsx(
            !mySolutionsCount && "hidden",
            "flex items-center space-x-1"
          )}
        >
          <FaUserCheck />
          <span className={clsx("text-yellow-300 text-sm")}>
            You have submission for this question
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {question.topics.map((topic) => (
            <TopicBadge key={topic} topic={topic} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className={clsx(!question.solutionCount && "hidden")}>
          <DifficultyLevelChip score={question.averageDifficultyScore} />
        </div>
        <div className="flex items-center gap-1">
          <AiOutlineSolution />
          <p>{question.solutionCount}</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
