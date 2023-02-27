import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
console.log("SENTRY_DSN", SENTRY_DSN);

Sentry.init({
  dsn: "https://e1383b9687ef4a07adf874d826f33db5@o4504745829203968.ingest.sentry.io/4504745829269504",
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
