// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { difficultyRatingOptionRouter } from "./difficulty-rating-option";
import { pastPaperRouter } from "./past-paper";
import { questionRouter } from "./question";
import { solutionRouter } from "./solution";
import { solutionVoteRouter } from "./solutionVote";
import { subjectRouter } from "./subject";
import { subjectTopicRouter } from "./subjectTopic";

export const appRouter = router({
  auth: authRouter,
  subject: subjectRouter,
  pastPaper: pastPaperRouter,
  question: questionRouter,
  subjectTopic: subjectTopicRouter,
  solution: solutionRouter,
  solutionVote: solutionVoteRouter,
  difficultyRatingOption: difficultyRatingOptionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
