import Chat from "../../../components/Chat";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserTokenById } from "../../_lib/data-service";

const ChatPage = async () => {
  // get user id
  const user = await currentUser();
  const userId = user.id;
  const userToken = await getUserTokenById(userId);
  console.log("USER HAS TOKEN", userToken);
  console.log("type", typeof userToken);
  return (
    <div>
      <Chat token={userToken}></Chat>
    </div>
  );
};

export default ChatPage;
