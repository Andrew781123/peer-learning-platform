import Input from "@/components/form/Input";
import Divider from "@/components/ui/Divider";
import { SolutionCommentItem } from "@/features/solution/components/solutionDetail/SolutionCommentItem";

type SolutionCommentProps = {};

export const SolutionCommentSection = ({}: SolutionCommentProps) => {
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
      <Input className="w-1/2 text-sm my-2" placeholder="Write a comment..." />

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
