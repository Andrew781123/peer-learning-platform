import { User } from "@prisma/client";
import { useMemo } from "react";

import { useUser } from "@/hooks/useUser";
import { getTimeFromX } from "@/server/utils/dates";

type SolutionCommentItemProps = {
  author: User;
  markdown: string;
  createdAt: Date;
};

export const SolutionCommentItem = ({
  author,
  markdown,
  createdAt,
}: SolutionCommentItemProps) => {
  const { user } = useUser();

  const displayName = useMemo(
    () => (user?.id === author.id ? "You" : author.name),
    [user, author]
  );

  return (
    <div className="space-y-1 py-2 w-full text-sm">
      <div className="space-x-2">
        <span className="text-gray-200 font-medium">{displayName}</span>
        <span className="text-gray-400">
          {getTimeFromX({ toDate: new Date(createdAt) })}
        </span>
      </div>

      <p className="text-gray-300">{markdown}</p>
    </div>
  );
};
