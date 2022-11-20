import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../server/trpc/router/_app";

export type Subject = inferProcedureOutput<
  AppRouter["subject"]["getAll"]
>[number];

export type SubjectTopic = inferProcedureOutput<
  AppRouter["subjectTopic"]["getAllBySubject"]
>[number];
