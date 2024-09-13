import Chat from "../../../components/Chat";
import { getUserById } from "../../_lib/data-service";
import { getServerSession } from "next-auth/next";

const ChatPage = async () => {
  /* session includes name,email,image*/
  const session = await getServerSession();

  console.log("SESSION", session);
  return (
    <h1> CHAT PAGE </h1>
    // <Chat
    // //   token={userDataFromDatabase.token}
    // //   daily_free_translations={userDataFromDatabase.daily_free_translations}
    // />
  );
};

export default ChatPage;
