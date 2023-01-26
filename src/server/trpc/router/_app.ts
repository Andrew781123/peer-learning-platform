// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { difficultyRatingOptionRouter } from "./difficulty-rating-option";
import { imgurRouter } from "./imgur";
import { pastPaperRouter } from "./past-paper";
import { questionRouter } from "./question";
import { solutionRouter } from "./solution";
import { solutionVoteRouter } from "./solution-vote";
import { subjectRouter } from "./subject";
import { subjectTopicRouter } from "./subject-topic";
import { testRouter } from "./test";

export const appRouter = router({
  auth: authRouter,
  subject: subjectRouter,
  pastPaper: pastPaperRouter,
  question: questionRouter,
  subjectTopic: subjectTopicRouter,
  solution: solutionRouter,
  solutionVote: solutionVoteRouter,
  difficultyRatingOption: difficultyRatingOptionRouter,
  imgur: imgurRouter,
  test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
