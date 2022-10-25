import { inferProcedureOutput } from "@trpc/server";
import { useRouter } from "next/router";
import { AppRouter } from "../../server/trpc/router/_app";

type SubjectCardProps = {
  subject: inferProcedureOutput<AppRouter["subject"]["getAll"]>[number];
};

const SubjectCard = (props: SubjectCardProps) => {
  const { subject } = props;

  const router = useRouter();

  const onSubjectCardClick = () => {
    router.push(`${router.pathname}/${subject.id}/past-papers`);
  };

  return (
    <div
      className="hover: flex h-48 cursor-pointer flex-col items-center justify-center bg-surface-default p-4 hover:bg-surface-light"
      onClick={onSubjectCardClick}
    >
      <p>{subject.id}</p>
      <p>{subject.title}</p>
    </div>
  );
};

export default SubjectCard;
