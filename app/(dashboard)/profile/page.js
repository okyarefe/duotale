import { UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  // If user exists, render the user profile
  return <UserProfile routing="hash" />;
};

export default ProfilePage;
