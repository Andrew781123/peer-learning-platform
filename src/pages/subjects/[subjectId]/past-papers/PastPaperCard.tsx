import { inferProcedureOutput } from "@trpc/server";
import { useRouter } from "next/router";
import { AiOutlineLink } from "react-icons/ai";
import { AppRouter } from "../../../../server/trpc/router/_app";

type PastPaperCardProps = {
  pastPaper: inferProcedureOutput<
    AppRouter["pastPaper"]["getAllBySubject"]
  >[number];
};

const PastPaperCard = (props: PastPaperCardProps) => {
  const { pastPaper } = props;

  const router = useRouter();

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
      className="flex items-center  bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light"
      onClick={onSubjectCardClick}
    >
      <p className="mr-3">{pastPaper.academicYear}</p>
      <span
        className="p-1 hover:bg-surface-dark"
        onClick={(e) => onLinkClick(e, pastPaper.link)}
      >
        <AiOutlineLink />
      </span>
    </div>
  );
};

export default PastPaperCard;
