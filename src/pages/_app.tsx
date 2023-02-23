// src/pages/_app.tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { withPasswordProtect } from "next-password-protect";
import type { AppType } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";

import Layout from "@/components/ui/Layout";
import { ImageModalContextProvider } from "@/hooks/useImageModalContext";
import { trpc } from "@/utils/trpc";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  console.log(process.env.ENVIRONMENT);
  return (
    <SessionProvider session={session}>
      <ImageModalContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
        <NextNProgress startPosition={0.5} options={{ showSpinner: false }} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ImageModalContextProvider>
    </SessionProvider>
  );
};

export default process.env.PASSWORD_PROTECT === "true"
  ? withPasswordProtect(trpc.withTRPC(MyApp), {
      loginApiUrl: "/api/preview/login",
      checkApiUrl: "/api/preview/passwordCheck",
    })
  : trpc.withTRPC(MyApp);
