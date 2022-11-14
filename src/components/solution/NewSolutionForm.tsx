import { inferProcedureOutput } from "@trpc/server";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import DIFFICULTY_RADIOS from "../../constants/difficultyRadios";
import useSelectOptions from "../../hooks/useSelectOptions";
import { AppRouter } from "../../server/trpc/router/_app";
import FormGroup from "../form/FormGroup";
import Input from "../form/Input";
import Label from "../form/Label";
import RadioGroup from "../form/RadioGroup";
import Select, { Option } from "../form/Select";
import reactQuillModules from "./react-quill-modules";
const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

type NewSolutionFormProps = {
  subjectTopics: inferProcedureOutput<
    AppRouter["subjectTopic"]["getAllBySubject"]
  >;
  subjects: inferProcedureOutput<AppRouter["subject"]["getAll"]>;
};

const NewSolutionForm = (props: NewSolutionFormProps) => {
  const { subjectTopics, subjects } = props;

  const { options: subjectTopicOptions } = useSelectOptions({
    data: subjectTopics,
    labelKey: "name",
    valueKey: "id",
  });

  const { options: subjectOptions } = useSelectOptions({
    data: subjects,
    labelKey: "id",
    valueKey: "id",
  });

  const [value, setValue] = useState<Option[]>([]);

  const [solutionText, setSolutionText] = useState("");

  return (
    <div>
      <FormGroup className="my-2">
        <Label text="Subject" />
        <Select
          multiple={false}
          value={subjectOptions[0]}
          onChange={() => {}}
          options={subjectOptions}
        />
      </FormGroup>

      <h2 className="mb-1 text-lg">Solutions</h2>
      <div className="bg-surface-default p-3">
        <FormGroup className="mb-4">
          <Label text="Question Number" />
          <Input type="number" />
        </FormGroup>

        <FormGroup className="my-4">
          <Label text="Difficulty" />
          <RadioGroup radios={DIFFICULTY_RADIOS} />
        </FormGroup>

        <FormGroup className="my-4">
          <Label text="Topics" />
          <Select
            multiple={true}
            value={value}
            onChange={setValue}
            options={subjectTopicOptions}
          />
        </FormGroup>

        <h2 className="mb-2">Write your solution here</h2>
        {ReactQuill ? (
          <ReactQuill
            theme="snow"
            value={solutionText}
            onChange={setSolutionText}
            modules={reactQuillModules}
          />
        ) : null}
      </div>
      <button onClick={() => console.log({ solutionText })}>Submit</button>
    </div>
  );
};

export default NewSolutionForm;
