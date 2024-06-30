import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const MemberProfile = async () => {
  const user = await currentUser();

  const emailAddress = user.emailAddresses[0].emailAddress;
  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      {emailAddress}
    </div>
  );
};
export default MemberProfile;
