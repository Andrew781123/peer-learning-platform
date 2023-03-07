import { useCallback } from "react";

import Divider from "@/components/ui/Divider";
import {
  SolutionCommentForm,
  SolutionCommentSchema,
} from "@/features/solution/components/solutionDetail/SolutionCommentForm";
import { SolutionCommentItem } from "@/features/solution/components/solutionDetail/SolutionCommentItem";
import { trpc } from "@/utils/trpc";

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

  const { mutateAsync } = trpc.solutionComment.create.useMutation({});

  const onSubmit = useCallback(
    async (data: SolutionCommentSchema) => {
      console.log(data);
      await mutateAsync({
        markdown: data.markdown,
        solutionId,
      });
    },
    [solutionId, mutateAsync]
  );

  return (
    <div>
      <SolutionCommentForm onSubmit={onSubmit} />

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
