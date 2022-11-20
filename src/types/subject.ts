import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../server/trpc/router/_app";

export type GetAllSubjectsResponse = inferProcedureOutput<
  AppRouter["subject"]["getAll"]
>;
