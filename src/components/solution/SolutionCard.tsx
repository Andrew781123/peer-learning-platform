import { QuestionSolution } from "@prisma/client";

type SolutionCardProps = {
  solution: QuestionSolution;
};

const SolutionCard = (props: SolutionCardProps) => {
  const { solution } = props;

  return <div>{solution.id}</div>;
};

export default SolutionCard;
