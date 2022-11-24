import NextAuth, { type NextAuthOptions } from "next-auth";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ email, user, account, profile }) {
      const emailDomain = user.email?.split("@")[1];
      if (emailDomain !== "connect.polyu.hk")
        return "/api/auth/error?error=invalidEmailDomain";

      return true;
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

export default NextAuth(authOptions);
