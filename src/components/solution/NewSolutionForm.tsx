import { inferProcedureOutput } from "@trpc/server";
import { useState } from "react";
import { AppRouter } from "../../server/trpc/router/_app";
import FormGroup from "../form/FormGroup";
import Input from "../form/Input";
import Label from "../form/Label";
import Select, { Option } from "../form/Select";

type NewSolutionFormProps = {
  subjectTopics: inferProcedureOutput<
    AppRouter["subjectTopic"]["getAllBySubject"]
  >;
};

const NewSolutionForm = (props: NewSolutionFormProps) => {
  const { subjectTopics } = props;

  const subjectTopicOptions = subjectTopics.map<Option>((topic) => ({
    label: topic.name,
    value: topic.id.toString(),
  }));

  const [value, setValue] = useState<Option | undefined>(
    subjectTopicOptions[0] ?? undefined
  );

  return (
    <div>
      <FormGroup className="my-2">
        <Label text="Subject" />
      </FormGroup>

      <h2 className="mb-1 text-lg">Solutions</h2>
      <div className="bg-surface-default p-3">
        <FormGroup className="my-2">
          <Label text="Question Number" />
          <Input type="number" />
        </FormGroup>

        <FormGroup>
          <Label text="Topics" />
          <Select
            value={value}
            onChange={setValue}
            options={subjectTopics.map((topic) => ({
              label: topic.name,
              value: topic.id.toString(),
            }))}
          />
        </FormGroup>
      </div>
    </div>
  );
};

export default NewSolutionForm;
