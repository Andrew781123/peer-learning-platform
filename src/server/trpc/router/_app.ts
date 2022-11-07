// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { pastPaperRouter } from "./past-paper";
import { questionRouter } from "./question";
import { subjectRouter } from "./subject";
import { subjectTopicRouter } from "./subjectTopic";

export const appRouter = router({
  auth: authRouter,
  subject: subjectRouter,
  pastPaper: pastPaperRouter,
  question: questionRouter,
  subjectTopic: subjectTopicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
