import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../../server/trpc/router/_app";

type PastPaperCardProps = {
  pastPaper: inferProcedureOutput<
    AppRouter["pastPaper"]["getAllBySubject"]
  >[number];
};

const PastPaperCard = (props: PastPaperCardProps) => {
  const { pastPaper } = props;

  return (
    <div className="flex items-center  bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light">
      <p>{pastPaper.academicYear}</p>
    </div>
  );
};

export default PastPaperCard;
