import { zodResolver } from "@hookform/resolvers/zod";
import {
  DifficultyRatingOption,
  PastPaper,
  Subject,
  SubjectTopic,
} from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";
import useSelectOptions from "../../hooks/useSelectOptions";
import { trpc } from "../../utils/trpc";
import FormGroup from "../form/FormGroup";
import Input from "../form/Input";
import Label from "../form/Label";
import RadioGroup from "../form/RadioGroup";
import Select from "../form/Select";
import Button from "../ui/Button";
import CrossButton from "../ui/CrossButton";
import reactQuillModules from "./react-quill-modules";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const DEFAULT_SOLUTION = {
  questionNumber: "1",
  topicIds: [],
  solutionText: "",
};

const solutionSchema = z.object({
  subjectId: z.string(),
  pastPaperId: z.number(),
  solutions: z.array(
    z.object({
      questionNumber: z.string().min(1),
      difficultyRatingLabel: z.string().min(1),
      topicIds: z.array(z.number()).min(1),
      solutionText: z.string(),
    })
  ),
});

type NewSolutionFormProps = {
  subjectTopics: SubjectTopic[];
  subjects: Subject[];
  pastPapers: PastPaper[];
  difficultyRatingOptions: DifficultyRatingOption[];
};

const NewSolutionForm = (props: NewSolutionFormProps) => {
  const { subjectTopics, subjects, pastPapers, difficultyRatingOptions } =
    props;

  const router = useRouter();

  const trpcContext = trpc.useContext();

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

  const { options: difficultyRatingRadioOptions } = useSelectOptions({
    data: difficultyRatingOptions,
    labelKey: "name",
    valueKey: "value",
  });

  const mutation = trpc.solution.createMany.useMutation({
    onSuccess: () => {
      trpcContext.question.getAllByPastPaper.invalidate();
      router.push("/");
    },
    onSettled: () => {
      reset();
    },
    // onError: () => console.log("error mutation"),
  });

  const { handleSubmit, register, control, reset, formState } = useForm<
    z.infer<typeof solutionSchema>
  >({
    defaultValues: {
      subjectId: subjectOptions[0]!.value,
      pastPaperId: pastPaperOptions[0]!.value,
      solutions: [DEFAULT_SOLUTION],
    },
    resolver: zodResolver(solutionSchema),
  });

  useEffect(() => {
    console.log(123123, !!formState.errors.solutions?.[1]?.questionNumber);
    console.log(formState.errors);
  }, [formState]);

  const { fields, append, remove } = useFieldArray({
    name: "solutions",
    control,
  });

  const addSolutionFormItem = () => {
    append({
      questionNumber: "",
      topicIds: [],
      difficultyRatingLabel: "",
      solutionText: "",
    });
  };

  const removeSolutionFormItem = (index: number) => {
    if (fields.length === 1) return;
    remove(index);
  };

  const onSubmit: SubmitHandler<z.infer<typeof solutionSchema>> = (data) => {
    mutation.mutate({
      pastPaperId: data.pastPaperId,
      solutions: data.solutions.map((solution) => ({
        questionNumber: parseInt(solution.questionNumber),
        markdown: solution.solutionText,
        difficultyRatingId: difficultyRatingOptions.find(
          (option) => option.name === solution.difficultyRatingLabel
        )!.id,
        topicIds: solution.topicIds,
      })),
    });
  };

  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) =>
  //     console.log(value, name, type)
  //   );
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup className="my-2">
        <Label text="Subject" />
        <Controller
          name="subjectId"
          control={control}
          render={({ field: { ref, ...restFields } }) => (
            <Select
              {...restFields}
              myRef={ref}
              multiple={false}
              options={subjectOptions}
            />
          )}
        />
      </FormGroup>

      <FormGroup className="my-2">
        <Label text="Past Paper" />
        <Controller
          name="pastPaperId"
          control={control}
          render={({ field: { ref, ...restFields } }) => (
            <Select
              {...restFields}
              myRef={ref}
              multiple={false}
              options={pastPaperOptions}
            />
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
            {fields.length > 1 ? (
              <CrossButton
                onClick={() => removeSolutionFormItem(index)}
                className="absolute top-3 right-3 font-medium"
              />
            ) : null}

            <FormGroup
              className="mb-4"
              error={!!formState.errors.solutions?.[index]?.questionNumber}
            >
              <Label text="Question Number" />
              <Input
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                {...register(`solutions.${index}.questionNumber`)}
              />
            </FormGroup>

            <FormGroup
              className="my-4"
              error={
                !!formState.errors.solutions?.[index]?.difficultyRatingLabel
              }
            >
              <Label text="Difficulty" />
              <RadioGroup
                radios={difficultyRatingRadioOptions}
                {...register(`solutions.${index}.difficultyRatingLabel`)}
              />
            </FormGroup>

            <FormGroup
              className="my-4"
              error={!!formState.errors.solutions?.[index]?.topicIds}
            >
              <Label text="Topics" />
              <Controller
                name={`solutions.${index}.topicIds`}
                control={control}
                render={({ field: { ref, ...restFields } }) => (
                  <Select
                    {...restFields}
                    myRef={ref}
                    multiple={true}
                    options={subjectTopicOptions}
                    error={!!formState.errors.solutions?.[index]?.topicIds}
                  />
                )}
              />
            </FormGroup>

            <FormGroup className="mb-2" labelPosition="top">
              <Label text="Write your solution here" />
              <Controller
                name={`solutions.${index}.solutionText`}
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <ReactQuill
                    {...rest}
                    theme="snow"
                    modules={reactQuillModules}
                  />
                )}
              />
            </FormGroup>
          </div>
        ))}
        <Button type="button" onClick={addSolutionFormItem}>
          Add Solution
        </Button>
      </div>

      <Button
        primary
        type="submit"
        disabled={mutation.isLoading}
        className="mt-2 ml-auto block"
      >
        Submit
      </Button>
    </form>
  );
};

export default NewSolutionForm;
