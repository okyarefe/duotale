import Chat from "../../../components/Chat";
import { currentUser } from "@clerk/nextjs/server";
import { getUserTokenById } from "../../_lib/data-service";

const ChatPage = async () => {
  // get user id
  const user = await currentUser();
  const userId = user.id;
  if (!userId) return <h1>Not authorized</h1>;

  const userTokenObj = await getUserTokenById(userId);

  if (!userTokenObj || userTokenObj.length === 0 || !userTokenObj[0].token) {
    console.error("Token not found for user ID:", userId);
    return <h1>User token not found</h1>;
  }

  const userToken = userTokenObj[0].token;

  return (
    <div>
      <Chat token={userToken} userId={userId}></Chat>
    </div>
  );
};

export default ChatPage;
