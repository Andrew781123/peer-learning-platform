import NextAuth, { type NextAuthOptions } from "next-auth";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "../../../server/db/client";
import { getEmailDomain } from "../../../utils/auth";
import { getQueryParams } from "../../../utils/url";
import { NextApiRequest, NextApiResponse } from "next";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ email, user, account, profile }) {
      if (process.env.NODE_ENV === "development") return true;

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
  // Workaround for known email scanners that send GET or HEAD requests which have
  // the effect of cancelling the one time token. We have seen:

  // HEAD request with user-agent: Barracude Sentinel (EE)
  // GET request with user-agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729)
  if (
    req.method === "HEAD"
    // /Mozilla.+MSIE.+Windows NT.+WOW64.+Trident.+SLCC2.+NET CLR/.test(
    //   req.headers["user-agent"]
    // ) ||
    // /lua-resty-http.+ngx_lua/.test(req.headers["user-agent"])
  ) {
    return res.status(200).send("Please visit the link from a browser.");
  }

  // GET request with double URL encoded param callbackUrl=https%253A%252F%252F
  if (req.url?.includes("callbackUrl=https%253A%252F%252F"))
    return res
      .status(400)
      .send("Your proxy has mangled the callbackUrl parameter in the URL.");

  return authHandler(req, res);
}
