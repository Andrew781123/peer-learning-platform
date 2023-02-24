import clsx from "clsx";
import { FaUserAlt } from "react-icons/fa";

import { useUser } from "@/hooks/useUser";
import { getTimeFromX } from "@/server/utils/dates";

type SolutionInfoProps = {
  solutionName: string;
  authorId: string;
  createdAt: Date;
};

export const SolutionInfo = ({
  solutionName,
  authorId,
  createdAt,
}: SolutionInfoProps) => {
  const { user } = useUser();

  return (
    <>
      <p className="text-gray-400">
        from <span className="text-gray-300">{solutionName}</span>
      </p>

      <p className="text-gray-400">
        posted{" "}
        <span className="text-gray-300">
          {getTimeFromX({ toDate: new Date(createdAt) })}
        </span>
      </p>

      <div
        className={clsx(
          user?.id !== authorId && "hidden",
          "flex items-center space-x-1 text-yellow-300"
        )}
      >
        <FaUserAlt />
        <span>You are the </span>
        <span>Author</span>
      </div>
    </>
  );
};
