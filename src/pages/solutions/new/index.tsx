import { NextPage } from "next";
import FormGroup from "../../../components/form/FormGroup";
import Input from "../../../components/form/Input";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import PageHeader from "../../../components/ui/PageHeader";

type NewSolutionPageProps = {};

const NewSolutionPage: NextPage = (props: NewSolutionPageProps) => {
  const {} = props;

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Submit Solution" />
      </div>

      <FormGroup className="my-2">
        <Label text="Subject" />
        <Select>
          <option>EIE3112</option>
        </Select>
      </FormGroup>

      <FormGroup className="my-2">
        <Label text="Question Number" />
        <Input type="number" />
      </FormGroup>
    </div>
  );
};

export default NewSolutionPage;
