import { PastPaper } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/router";
import { AiOutlineLink } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";

import { useUser } from "@/hooks/useUser";
import { trpc } from "@/utils/trpc";

type PastPaperCardProps = {
  pastPaper: PastPaper & {
    questionsCount: number;
    solutionsCount: number;
  };
};

const PastPaperCard = (props: PastPaperCardProps) => {
  const { pastPaper } = props;

  const router = useRouter();
  const { user } = useUser();

  const { data: mySubmissionCount = 0 } =
    trpc.pastPaper.getMySubmissionsCount.useQuery(
      {
        pastPaperId: pastPaper.id,
      },
      {
        enabled: !!user,
      }
    );

  const onSubjectCardClick = () => {
    router.push(`${router.asPath}/${pastPaper.id}/questions`);
  };

  const onLinkClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    pastPaperUrl: string
  ) => {
    window.open(pastPaperUrl);
    e.stopPropagation();
  };

  return (
    <div
      className="flex items-center bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light"
      onClick={onSubjectCardClick}
    >
      <div className="flex items-center">
        <p className="mr-3">{pastPaper.academicYear}</p>
        <span
          className="rounded-[50%] p-1 hover:bg-surface-default"
          onClick={(e) => onLinkClick(e, pastPaper.link)}
        >
          <AiOutlineLink />
        </span>
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-400">
          <span className="text-gray-300">{pastPaper.questionsCount}</span>{" "}
          Questions answered
        </p>
        <p className="text-sm text-gray-400 flex items-center space-x-1">
          <span className="text-gray-300">{pastPaper.solutionsCount}</span>
          <span>Submissions</span>
          <span
            className={clsx(!mySubmissionCount && "hidden", "text-gray-400")}
          >
            &#x2022;
          </span>
          <div
            className={clsx(
              !mySubmissionCount && "hidden",
              "flex items-center space-x-1"
            )}
          >
            <span className={clsx("text-yellow-800 text-sm font-bold")}>
              {mySubmissionCount}
            </span>
            <FaUserAlt className="text-yellow-800" />
          </div>
        </p>
      </div>
    </div>
  );
};

export default PastPaperCard;
