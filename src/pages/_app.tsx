// src/pages/_app.tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import Layout from "../components/ui/Layout";
import "../styles/globals.scss";
import "../styles/react-quill.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
