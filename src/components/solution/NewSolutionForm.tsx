import FormGroup from "../form/FormGroup";
import Input from "../form/Input";
import Label from "../form/Label";
import Select from "../form/Select";

type NewSolutionFormProps = {};

const NewSolutionForm = (props: NewSolutionFormProps) => {
  const {} = props;

  return (
    <div>
      <FormGroup className="my-2">
        <Label text="Subject" />
        <Select>
          <option>EIE3112</option>
        </Select>
      </FormGroup>

      <h2 className="mb-1 text-lg">Solutions</h2>
      <div className="bg-surface-default p-3">
        <FormGroup className="my-2">
          <Label text="Question Number" />
          <Input type="number" />
        </FormGroup>
      </div>
    </div>
  );
};

export default NewSolutionForm;
