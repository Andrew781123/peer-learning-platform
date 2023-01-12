import { QuestionSolution } from "@prisma/client";

type SolutionCardProps = {
  solution: QuestionSolution;
};

const SolutionCard = (props: SolutionCardProps) => {
  const { solution } = props;

  return <div className="flex flex-col gap-3"></div>;
};

export default SolutionCard;
