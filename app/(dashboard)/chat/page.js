import Chat from "../../../components/Chat";
import { currentUser } from "@clerk/nextjs/server";
import {
  getUserTokenById,
  createUserIfNotExists,
} from "../../_lib/data-service";

const ChatPage = async () => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      console.log("There is no CURRENT USER");
      return <h1>Not authorized</h1>;
    }

    const userId = user.id;

    // Check if user exists in database, if not create the user
    await createUserIfNotExists(user);

    // Implement a retry mechanism with a maximum number of attempts
    const maxAttempts = 5;
    const retryDelay = 1000; // 1 second
    let userToken = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      userToken = await getUserTokenById(userId);

      if (userToken !== null && userToken !== undefined) {
        break;
      }

      console.log(
        `Token not found, retrying... (Attempt ${attempt + 1}/${maxAttempts})`
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    if (!userToken) {
      console.error("Failed to retrieve user token after multiple attempts");
      return <h1>Error: Unable to retrieve user token</h1>;
    }

    console.log("Token found", userToken);

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
