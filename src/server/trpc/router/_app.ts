// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { subjectRouter } from "./subject";

export const appRouter = router({
  auth: authRouter,
  subject: subjectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
