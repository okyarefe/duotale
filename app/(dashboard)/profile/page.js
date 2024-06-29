import { UserProfile } from "@clerk/nextjs";
const ProfilePage = () => {
  return <UserProfile routing="hash"></UserProfile>;
};

export default ProfilePage;
