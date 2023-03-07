import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Input from "@/components/form/Input";

const commentSchema = z.object({
  markdown: z.string().min(1),
});

export type SolutionCommentSchema = z.infer<typeof commentSchema>;

type SolutionCommentFormProps = {
  onSubmit: (data: SolutionCommentSchema) => void;
};
export const SolutionCommentForm = ({ onSubmit }: SolutionCommentFormProps) => {
  const { register, handleSubmit, formState } = useForm<SolutionCommentSchema>({
    defaultValues: {
      markdown: "",
    },
    resolver: zodResolver(commentSchema),
  });

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
