// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { prisma } from "../../../server/db/client";
import { getEmailDomain } from "../../../utils/auth";
import { getQueryParams } from "../../../utils/url";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ email, user, account, profile }) {
      if (process.env.NODE_ENV !== "production") return true;

      if (!user.email) return false;

      const emailDomain = getEmailDomain(user.email);
      if (emailDomain !== "connect.polyu.hk")
        return "/api/auth/error?error=invalidEmailDomain";

      return true;
    },
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        const queryParams = getQueryParams(url);
        if (queryParams.callbackUrl) {
          return queryParams.callbackUrl;
        }

        return url;
      }

      return baseUrl;
    },

    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  pages: {
    newUser: "/auth/new-user",
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-email",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
};

const authHandler = NextAuth(authOptions);

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers["x-vercel-ip-country"] === "JP") {
    return res.status(200).send("Please visit the link from a browser.");
  }

  return authHandler(req, res);
}
