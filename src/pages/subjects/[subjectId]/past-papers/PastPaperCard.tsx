import { inferProcedureOutput } from "@trpc/server";
import { useRouter } from "next/router";
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

  return (
    <div
      className="flex items-center  bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light"
      onClick={onSubjectCardClick}
    >
      <p>{pastPaper.academicYear}</p>
    </div>
  );
};

export default PastPaperCard;
