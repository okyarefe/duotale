import Chat from "../../../components/Chat";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "../../_lib/data-service";

const ChatPage = async () => {
  const { userId, sessionId } = auth();
  let userDataFromDatabase;
  if (userId) {
    try {
      userDataFromDatabase = await getUserById(userId);
      if (!userDataFromDatabase) {
        throw new Error("User not found in database");
      }
    } catch (error) {
      console.log("Error querying user data from database", error);
    }
  }

  return (
    <Chat
    // token={userDataFromDatabase.token}
    // daily_free_translations={userDataFromDatabase.daily_free_translations}
    />
  );
};

export default ChatPage;
