import Chat from "../../../components/Chat";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "../../_lib/data-service";
import { notFound } from "next/navigation";

const ChatPage = async () => {
  const { userId, sessionId } = auth();

  try {
    const userDataFromDatabase = await getUserById(userId);
    console.log("User data fetched successfully!");

    if (!userDataFromDatabase) {
      // Handle case where user data is not found
      throw new Error("User data not found");
    }

    return (
      <Chat
        token={userDataFromDatabase.token}
        daily_free_translations={userDataFromDatabase.daily_free_translations}
      />
    );
  } catch (error) {
    console.error("Error fetching user data:", error);

    // You can choose to render an error component or redirect to an error page
    return (
      <div className="error-container">
        <h1>Oops! Something went wrong</h1>
        <p>Were having trouble loading your data. Please try again later.</p>
      </div>
    );
  }
};

export default ChatPage;
