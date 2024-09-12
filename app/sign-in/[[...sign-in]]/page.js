import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
const SignInPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      {" "}
      <SignIn></SignIn>
    </div>
  );
};

export default SignInPage;
