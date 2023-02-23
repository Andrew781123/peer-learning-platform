import { PastPaper } from "@prisma/client";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useUser } from "@/hooks/useUser";
import { trpc } from "@/utils/trpc";

const AiOutlineLink = dynamic(
  () => import("react-icons/ai").then((mod) => mod.AiOutlineLink),
  { ssr: false }
);
const FaUserAlt = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaUserAlt),
  { ssr: false }
);

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
        <div className="text-sm text-gray-400 flex items-center space-x-1">
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
            <span className={clsx("text-yellow-300 text-sm font-bold")}>
              {mySubmissionCount}
            </span>
            <FaUserAlt className="text-yellow-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastPaperCard;
