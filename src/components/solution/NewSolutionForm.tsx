import { inferProcedureOutput } from "@trpc/server";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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

  const { handleSubmit, register, control, watch } = useForm({
    defaultValues: {
      subject: subjectOptions[0],
      solutions: [
        {
          questionNumber: "",
          difficulty: DIFFICULTY_RADIOS[0].label,
          topics: [] as Option[],
          solutionText: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    name: "solutions",
    control,
  });

  const onSubmit = (data: any) => {
    console.log({ data });
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup className="my-2">
        <Label text="Subject" />
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <Select {...field} multiple={false} options={subjectOptions} />
          )}
        />
      </FormGroup>

      <h2 className="mb-1 text-lg">Solutions</h2>
      {fields.map((solution, index) => (
        <div key={solution.id} className="bg-surface-default p-3">
          <FormGroup className="mb-4">
            <Label text="Question Number" />
            <Input
              type="number"
              {...register(`solutions.${index}.questionNumber`)}
            />
          </FormGroup>

          <FormGroup className="my-4">
            <Label text="Difficulty" />
            <RadioGroup
              radios={DIFFICULTY_RADIOS}
              {...register(`solutions.${index}.difficulty`)}
            />
          </FormGroup>

          <FormGroup className="my-4">
            <Label text="Topics" />
            <Controller
              name={`solutions.${index}.topics`}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple={true}
                  options={subjectTopicOptions}
                />
              )}
            />
          </FormGroup>

          <h2 className="mb-2">Write your solution here</h2>
          <Controller
            name={`solutions.${index}.solutionText`}
            control={control}
            render={({ field }) => (
              <ReactQuill {...field} theme="snow" modules={reactQuillModules} />
            )}
          />
        </div>
      ))}

      <button>Submit</button>
    </form>
  );
};

export default NewSolutionForm;
