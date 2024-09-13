import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
  },
  pages: {
    signIn: "/login",
  },
};

const authHandler = NextAuth(authConfig);
export default authHandler;
