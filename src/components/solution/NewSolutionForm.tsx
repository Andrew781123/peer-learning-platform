import { inferProcedureOutput } from "@trpc/server";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import DIFFICULTY_RADIOS from "../../constants/difficultyRadios";
import useSelectOptions from "../../hooks/useSelectOptions";
import { AppRouter } from "../../server/trpc/router/_app";
import { trpc } from "../../utils/trpc";
import FormGroup from "../form/FormGroup";
import Input from "../form/Input";
import Label from "../form/Label";
import RadioGroup from "../form/RadioGroup";
import Select, { Option } from "../form/Select";
import Button from "../ui/Button";
import CrossButton from "../ui/CrossButton";
import reactQuillModules from "./react-quill-modules";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type FormValues = {
  subject: Option<string>;
  pastPaper: Option<number>;
  solutions: {
    questionNumber: string;
    difficulty?: string;
    topics: Option[];
    solutionText: string;
  }[];
};

const DEFAULT_SOLUTION = {
  questionNumber: "1",
  topics: [],
  solutionText: "",
};

type NewSolutionFormProps = {
  subjectTopics: inferProcedureOutput<
    AppRouter["subjectTopic"]["getAllBySubject"]
  >;
  subjects: inferProcedureOutput<AppRouter["subject"]["getAll"]>;
  pastPapers: inferProcedureOutput<AppRouter["pastPaper"]["getAllBySubject"]>;
};

const NewSolutionForm = (props: NewSolutionFormProps) => {
  const { subjectTopics, subjects, pastPapers } = props;

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

  const { options: pastPaperOptions } = useSelectOptions({
    data: pastPapers,
    labelKey: "academicYear",
    valueKey: "id",
  });

  const mutation = trpc.solution.createMany.useMutation();

  const { handleSubmit, register, control, watch, getValues } =
    useForm<FormValues>({
      defaultValues: {
        subject: subjectOptions[0],
        pastPaper: pastPaperOptions[0],
        solutions: [DEFAULT_SOLUTION],
      },
    });

  const { fields, append, remove } = useFieldArray({
    name: "solutions",
    control,
  });

  const addSolutionFormItem = () => {
    append({
      ...DEFAULT_SOLUTION,
      questionNumber: "",
    });
  };

  const removeSolutionFormItem = (index: number) => {
    if (fields.length === 1) return;
    remove(index);
  };

  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      pastPaperId: data.pastPaper.value,
      solutions: data.solutions.map((solution) => ({
        questionNumber: parseInt(solution.questionNumber),
        markdown: solution.solutionText,
      })),
    });
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

      <FormGroup className="my-2">
        <Label text="Past Paper" />
        <Controller
          name="pastPaper"
          control={control}
          render={({ field }) => (
            <Select {...field} multiple={false} options={pastPaperOptions} />
          )}
        />
      </FormGroup>

      <h2 className="mb-1 text-lg">Solutions</h2>
      <div className="flex flex-col items-center gap-5 rounded-lg bg-surface-default p-6">
        {fields.map((solution, index) => (
          <div
            key={solution.id}
            className="relative w-full rounded-lg border border-onBackground p-3 focus:border-primary-default"
          >
            <CrossButton
              onClick={() => removeSolutionFormItem(index)}
              className="absolute top-3 right-3 font-medium"
            />
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
                <ReactQuill
                  {...field}
                  theme="snow"
                  modules={reactQuillModules}
                />
              )}
            />
          </div>
        ))}
        <Button primary onClick={addSolutionFormItem}>
          Add Solution
        </Button>
      </div>

      <Button primary type="submit" className="mt-2 ml-auto block">
        Submit
      </Button>
    </form>
  );
};

export default NewSolutionForm;