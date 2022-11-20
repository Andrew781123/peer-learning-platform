import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../server/trpc/router/_app";

export type PastPaper = inferProcedureOutput<
  AppRouter["pastPaper"]["getAllBySubject"]
>[number];
