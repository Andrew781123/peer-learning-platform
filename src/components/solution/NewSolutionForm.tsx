import { zodResolver } from "@hookform/resolvers/zod";
import {
  DifficultyRatingOption,
  PastPaper,
  Subject,
  SubjectTopic,
} from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import useSelectOptions from "../../hooks/useSelectOptions";
import { trpc } from "../../utils/trpc";
import FormGroup from "../form/FormGroup";
import Input from "../form/Input";
import Label from "../form/Label";
import MarkdownEditor from "../form/MarkdownEditor/MarkdownEditor";
import RadioGroup from "../form/RadioGroup";
import Select from "../form/Select";
import Button from "../ui/Button";
import CrossButton from "../ui/CrossButton";

const DEFAULT_SOLUTION = {
  questionNumber: "1",
  topicIds: [],
  solutionText: "",
  difficultyRatingLabel: "",
};

const solutionSchema = z.object({
  subjectId: z.string(),
  pastPaperId: z
    .number({
      required_error: "Please select a past paper",
    })
    .int(),
  solutions: z
    .array(
      z.object({
        questionNumber: z
          .string({
            required_error:
              "Please enter the question number for this question",
          })
          .min(1, "Please enter the question number for this question")
          .regex(/^[1-9]\d*$/, "Please enter a valid question number"),
        difficultyRatingLabel: z
          .string({
            required_error: "Please select a difficulty level",
          })
          .min(1, "Please select a difficulty level"),
        topicIds: z
          .array(z.number())
          .min(1, "Please select at least one topic"),
        solutionText: z.string().min(1, "Please fill in the solution"),
      })
    )
    .refine(
      (solutions) => {
        const questionNumbers = solutions.map(
          (solution) => solution.questionNumber
        );

        const uniqueQuestionNumbers = new Set(questionNumbers);

        return (
          questionNumbers.length === uniqueQuestionNumbers.size &&
          questionNumbers.every((questionNumber) =>
            uniqueQuestionNumbers.has(questionNumber)
          )
        );
      },
      (solutions) => {
        const questionNumberToCountMap = solutions.reduce(
          (map, { questionNumber }, index) => {
            return {
              ...map,
              [questionNumber]: [...(map[questionNumber] ?? []), index],
            };
          },
          {} as Record<string, number[]>
        );

        const duplicateQuestionNumbers = Object.entries(
          questionNumberToCountMap
        )
          .filter(([_, indexes]) => indexes.length > 1)
          .map(
            ([questionNumber, indexes]) =>
              [questionNumber, indexes] as [string, number[]]
          );

        const firstDuplicatedQuestionNumberInfo = duplicateQuestionNumbers[0];

        if (!firstDuplicatedQuestionNumberInfo) return {};

        const [firstDuplicatedQuestionNumber, indexes] =
          firstDuplicatedQuestionNumberInfo;
        firstDuplicatedQuestionNumber;

        // TODO - return array of paths to show errors for each duplicated question number
        return {
          message: `You have already answered question number ${firstDuplicatedQuestionNumber} above`,
          path: [indexes[indexes.length - 1]!, "questionNumber"],
        };
      }
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

  const [isPreview, setIsPreview] = useState<Record<string, boolean>>({});

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
      toast.success("Submission created");
      router.push("/");
    },
    onError: () =>
      toast.error("Error creating solutions, please try again later"),
  });

  const { handleSubmit, register, control, reset, formState, watch, setValue } =
    useForm<z.infer<typeof solutionSchema>>({
      defaultValues: {
        subjectId: subjectOptions[0]!.value,
        pastPaperId: undefined,
        solutions: [DEFAULT_SOLUTION],
      },
      resolver: zodResolver(solutionSchema),
    });

  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) =>
  //     console.log(value, name, type)
  //   );
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const { fields, append, remove } = useFieldArray({
    name: "solutions",
    control,
  });

  useEffect(() => {
    const newIsPreview = fields.reduce((result, { id }) => {
      return {
        ...result,
        [id]: isPreview[id] ?? false,
      };
    }, {});

    setIsPreview(newIsPreview);
  }, [fields]);

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

  const togglePreview = (id: string) => {
    setIsPreview((isPreview) => ({
      ...isPreview,
      [id]: !isPreview[id],
    }));
  };

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
              error={!!formState.errors.pastPaperId}
              errorText={formState.errors.pastPaperId?.message}
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
            className={clsx(
              formState.errors.solutions?.[index]
                ? "border-red-500"
                : "border-onBackground",
              "relative w-full rounded-lg border  p-3 focus:border-primary-default"
            )}
          >
            {fields.length > 1 ? (
              <CrossButton
                onClick={() => removeSolutionFormItem(index)}
                className="absolute top-3 right-3 font-medium"
              />
            ) : null}

            <FormGroup
              className="mb-7"
              error={!!formState.errors.solutions?.[index]?.questionNumber}
            >
              <Label text="Question Number" />
              <Input
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="e.g. 1"
                errorText={
                  formState.errors.solutions?.[index]?.questionNumber?.message
                }
                {...register(`solutions.${index}.questionNumber`)}
              />
            </FormGroup>

            <FormGroup
              className="my-7"
              error={
                !!formState.errors.solutions?.[index]?.difficultyRatingLabel
              }
            >
              <Label text="Difficulty" />
              <RadioGroup
                radios={difficultyRatingRadioOptions}
                errorText={
                  formState.errors.solutions?.[index]?.difficultyRatingLabel
                    ?.message
                }
                {...register(`solutions.${index}.difficultyRatingLabel`)}
              />
            </FormGroup>

            <FormGroup
              className="my-7"
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
                    errorText={
                      formState.errors.solutions?.[index]?.topicIds?.message
                    }
                  />
                )}
              />
            </FormGroup>

            <FormGroup
              className="mb-2"
              labelPosition="top"
              error={!!formState.errors.solutions?.[index]?.solutionText}
            >
              <Label
                text={
                  <div className="flex items-center justify-between">
                    <p>Write your solution of all sub-questions here</p>
                    <Button
                      type="button"
                      onClick={() => togglePreview(solution.id)}
                      size="small"
                    >
                      {isPreview[index] ? "Edit" : "Preview"}
                    </Button>
                  </div>
                }
              />
              <Controller
                name={`solutions.${index}.solutionText`}
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <MarkdownEditor
                    editorRef={ref}
                    isPreview={!!isPreview[solution.id]}
                    {...rest}
                  />
                )}
              />

              <p className="text-sm text-red-500">
                {formState.errors.solutions?.[index]?.solutionText?.message}
              </p>
            </FormGroup>
          </div>
        ))}
        <Button type="button" onClick={addSolutionFormItem}>
          Answer another question
        </Button>
      </div>

      <Button
        primary
        type="submit"
        isLoading={mutation.isLoading}
        className="mt-2 ml-auto block"
      >
        Submit
      </Button>
    </form>
  );
};

export default NewSolutionForm;
