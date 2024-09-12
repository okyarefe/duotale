import Chat from "../../../components/Chat";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "../../_lib/data-service";
import { notFound } from "next/navigation";
import Spinner from "@/components/Spinner";
import { revalidatePath } from "next/cache";

const ChatPage = async () => {
  const { userId } = auth();

  try {
    console.log("I RUN NOW******");
    const userDataFromDatabase = await getUserById(userId);
    return (
      <Chat
        token={userDataFromDatabase.token}
        daily_free_translations={userDataFromDatabase.daily_free_translations}
      />
    );
  } catch (error) {
    revalidatePath("/chat");
    return (
      <div>
        <p>Error </p>
      </div>
    );
  }
};

export default ChatPage;
