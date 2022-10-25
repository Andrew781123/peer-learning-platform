// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { pastPaperRouter } from "./past-paper";
import { subjectRouter } from "./subject";

export const appRouter = router({
  auth: authRouter,
  subject: subjectRouter,
  pastPaper: pastPaperRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
