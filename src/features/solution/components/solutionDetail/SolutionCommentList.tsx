import Divider from "@/components/ui/Divider";
import { SolutionCommentItem } from "@/features/solution/components/solutionDetail/SolutionCommentItem";
import { trpc } from "@/utils/trpc";

type SolutionCommentListProps = {
  solutionId: string;
};
export const SolutionCommentList = ({
  solutionId,
}: SolutionCommentListProps) => {
  const { data: comments = [] } = trpc.solutionComment.getAll.useQuery({
    where: { solutionId },
  });

  return (
    <div>
      <Divider />
      {comments.map((comment) => (
        <>
          <SolutionCommentItem
            key={comment.id}
            username={comment.user.name!}
            markdown={comment.markdown}
            createdAt={comment.createdAt}
          />
          <Divider />
        </>
      ))}

      <button className="text-primary-dark hover:underline">Load more</button>
    </div>
  );
};
