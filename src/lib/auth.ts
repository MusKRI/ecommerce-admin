import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import { compare } from "bcrypt";

import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(crendentials, req) {
        if (!crendentials?.email || !crendentials.password) {
          return null;
        }

        const doesExist = await prisma.user.findUnique({
          where: {
            email: crendentials.email,
          },
        });

        if (!doesExist) {
          return null;
        }

        const doesPasswordMatch = await compare(
          crendentials.password,
          doesExist.password
        );

        if (!doesPasswordMatch) {
          return null;
        }

        return {
          id: doesExist.id,
          email: doesExist.email,
          username: doesExist.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("in jwt callback, token => ", token);
      // console.log("in jwt callback, user => ", user);

      if (user) {
        return {
          ...token,
          userId: user.id,
          username: user.username,
        };
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          userId: token.userId,
          username: token.username,
        },
      };
    },
  },
};
