import { inferProcedureOutput } from "@trpc/server";

import { AppRouter } from "../server/trpc/router/_app";

export type GetAllSolutionsResponse = inferProcedureOutput<
  AppRouter["solution"]["getAllByQuestion"]
>;
