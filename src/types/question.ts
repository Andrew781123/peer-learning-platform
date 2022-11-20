import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../server/trpc/router/_app";

export type GetAllQuestionsByPastPaperResponse = inferProcedureOutput<
  AppRouter["question"]["getAllByPastPaper"]
>;
