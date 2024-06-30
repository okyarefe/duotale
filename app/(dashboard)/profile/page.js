import { UserProfile } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const ProfilePage = async () => {
  try {
    const user = await currentUser();

    const emailAddress = user.emailAddresses[0].emailAddress;

    console.log("USER LOGGED", emailAddress);

    return <UserProfile routing="hash"></UserProfile>;
  } catch (error) {
    <Link href="/"></Link>;
  }
};

export default ProfilePage;
