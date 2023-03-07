import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import Input from "@/components/form/Input";
import { useUser } from "@/hooks/useUser";
import { trpc } from "@/utils/trpc";

const commentSchema = z.object({
  markdown: z.string().min(1),
});

export type SolutionCommentSchema = z.infer<typeof commentSchema>;

type SolutionCommentFormProps = {
  solutionId: string;
};
export const SolutionCommentForm = ({
  solutionId,
}: SolutionCommentFormProps) => {
  const { user } = useUser();

  const { mutateAsync } = trpc.solutionComment.create.useMutation({
    onSuccess: () => {
      reset();
    },
    onError: () => {
      toast.error("Failed to create comment");
    },
  });

  const { register, handleSubmit, formState, reset } =
    useForm<SolutionCommentSchema>({
      defaultValues: {
        markdown: "",
      },
      resolver: zodResolver(commentSchema),
    });

  const onSubmit = useCallback(
    async (data: SolutionCommentSchema) => {
      if (!user) {
        toast.error("You must be logged in to comment");
        return;
      }

      await mutateAsync({
        markdown: data.markdown,
        solutionId,
      });
    },
    [solutionId, mutateAsync, user]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex gap-2 w-full">
        <Input
          className="w-1/2 text-sm my-2"
          placeholder="Write a comment..."
          {...register("markdown")}
        />

        <button
          className="cursor-pointer hover:underline text-primary-dark text-sm disabled:text-gray-500 disabled:cursor-default"
          disabled={formState.isSubmitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
};
