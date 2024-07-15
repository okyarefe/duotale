import Chat from "../../../components/Chat";
import { currentUser } from "@clerk/nextjs/server";
import { getUserTokenById } from "../../_lib/data-service";

const ChatPage = async () => {
  // get user id
  const user = await currentUser();
  const userId = user.id;
  if (!userId) return <h1>Not authorized</h1>;

  const userTokenObj = await getUserTokenById(userId);
  const userToken = userTokenObj[0].token;

  return (
    <div>
      <Chat token={userToken} userId={userId}></Chat>
    </div>
  );
};

export default ChatPage;
