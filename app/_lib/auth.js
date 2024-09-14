import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createUser, getUserByEmail } from "./data-service";

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      if (auth.user) true;
      else false;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingUser = await getUserByEmail(user.email);

        if (!existingUser) {
          await createUser(user.email);
        }
        return true;
      } catch (error) {
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
};

const authHandler = NextAuth(authConfig);
export default authHandler;
