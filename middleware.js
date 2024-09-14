export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/chat(.*)",
    "/dialogs(.*)",
    "/gettokens(.*)",
    "/features(.*)",
    "/profile(.*)",
  ],
};
