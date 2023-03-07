import Divider from "@/components/ui/Divider";
import { SolutionCommentForm } from "@/features/solution/components/solutionDetail/SolutionCommentForm";
import { SolutionCommentItem } from "@/features/solution/components/solutionDetail/SolutionCommentItem";

type SolutionCommentProps = {
  solutionId: string;
};

export const SolutionCommentSection = ({
  solutionId,
}: SolutionCommentProps) => {
  const comments = [
    {
      id: "1",
      markdown: "This is a comment",
      createdAt: new Date(),
      username: "user1",
    },
  ];

  return (
    <div>
      <SolutionCommentForm solutionId={solutionId} />

      <Divider />
      {comments.map((comment) => (
        <>
          <SolutionCommentItem key={comment.id} {...comment} />
          <Divider />
        </>
      ))}

      <button className="text-primary-dark hover:underline">Load more</button>
    </div>
  );
};
