import Chat from "../../../components/Chat";
import { currentUser } from "@clerk/nextjs/server";
import { getUserTokenById } from "../../_lib/data-service";

const ChatPage = async () => {
  try {
    // Get the current user
    const user = await currentUser();

    if (!user || !user.id) {
      return <h1>Not authorized</h1>;
    }

    const userId = user.id;

    // Get the user token
    const userToken = await getUserTokenById(userId);

    if (!userToken) {
      return <h1>User token not found</h1>;
    }

    return (
      <div>
        <Chat token={userToken} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching user or token:", error);
    return <h1>Error occurred</h1>;
  }
};

export default ChatPage;
