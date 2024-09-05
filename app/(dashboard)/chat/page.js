import Chat from "../../../components/Chat";
import { currentUser } from "@clerk/nextjs/server";
import {
  getUserTokenById,
  createUserIfNotExists,
} from "../../_lib/data-service";

const ChatPage = async () => {
  try {
    // Get the current user
    // User from clerk
    const user = await currentUser();

    if (!user || !user.id) {
      console.log("There is no CURRENT USER");
      return <h1>Not authorized</h1>;
    }

    const userId = user.id;

    // Check if user exists in database, if not create the user
    await createUserIfNotExists(user);

    // Get the user token
    // userToken from database
    let userToken = await getUserTokenById(userId);

    if (!userToken) {
      console.log("Token not found, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 1 second
      userToken = await getUserTokenById(userId);

      console.log("Token found", userToken);
    }

    return (
      <div>
        <Chat token={userToken} userId={userId} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching user or token:", error);
    return <h1>Error occurred</h1>;
  }
};

export default ChatPage;
