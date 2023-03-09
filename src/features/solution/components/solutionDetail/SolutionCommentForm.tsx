import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import Input from "@/components/form/Input";
import { useQueryParam } from "@/features/common/hooks/useQueryParam";
import { useUser } from "@/hooks/useUser";
import { trpc } from "@/utils/trpc";

const commentSchema = z.object({
  markdown: z.string().min(1),
});

export type SolutionCommentSchema = z.infer<typeof commentSchema>;

export const SolutionCommentForm = () => {
  const { user } = useUser();
  const trpcUtils = trpc.useContext();
  const { query } = useQueryParam<{ solutionId: string }>();

  const { mutateAsync } = trpc.solutionComment.create.useMutation({
    onSuccess: () => {
      toast.success("Comment created");
      trpcUtils.solutionComment.getAll.invalidate();
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

      // ? The empty catch block is a workaround for isSubmitting not being reset
      await mutateAsync({
        markdown: data.markdown,
        solutionId: query.solutionId,
      }).catch((err) => {});
    },
    [mutateAsync, user, query.solutionId]
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
