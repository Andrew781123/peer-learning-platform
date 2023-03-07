import { SolutionCommentForm } from "@/features/solution/components/solutionDetail/SolutionCommentForm";
import { SolutionCommentList } from "@/features/solution/components/solutionDetail/SolutionCommentList";

type SolutionCommentProps = {
  solutionId: string;
};

export const SolutionCommentSection = ({
  solutionId,
}: SolutionCommentProps) => {
  return (
    <div>
      <SolutionCommentForm solutionId={solutionId} />

      <SolutionCommentList solutionId={solutionId} />
    </div>
  );
};
