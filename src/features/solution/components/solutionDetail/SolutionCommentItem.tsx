import { getTimeFromX } from "@/server/utils/dates";

type SolutionCommentItemProps = {
  username: string;
  markdown: string;
  createdAt: Date;
};

export const SolutionCommentItem = ({
  username,
  markdown,
  createdAt,
}: SolutionCommentItemProps) => {
  return (
    <div className="space-y-1 py-2 w-full text-sm">
      <div className="space-x-2">
        <span className="text-gray-200 font-medium">{username}</span>
        <span className="text-gray-400">
          {getTimeFromX({ toDate: new Date(createdAt) })}
        </span>
      </div>

      <p className="text-gray-300">{markdown}</p>
    </div>
  );
};
