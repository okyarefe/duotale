import { UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const ProfilePage = async () => {
  try {
    const user = await currentUser();

    if (user) {
      return <UserProfile routing="hash"></UserProfile>;
    } else {
      return <h1>LOG IN</h1>;
    }
  } catch (error) {
    <Link href="/"></Link>;
  }
};

export default ProfilePage;
