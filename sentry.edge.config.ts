import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e1383b9687ef4a07adf874d826f33db5@o4504745829203968.ingest.sentry.io/4504745829269504",
  tracesSampleRate: 1.0,
});
