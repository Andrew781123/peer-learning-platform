import { NextPage } from "next";
import PageHeader from "../../../components/ui/PageHeader";

type NewSolutionPageProps = {};

const NewSolutionPage: NextPage = (props: NewSolutionPageProps) => {
  const {} = props;

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Submit Solution" />
      </div>
    </div>
  );
};

export default NewSolutionPage;
