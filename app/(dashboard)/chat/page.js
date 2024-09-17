import { getServerSession } from "next-auth/next";
import Chat from "@/components/Chat";
import { getUserByEmail } from "../../_lib/data-service";

const ChatPage = async () => {
  const session = await getServerSession();

  const userDataFromDatabase = await getUserByEmail(session.user.email);

  return (
    <>
      <Chat
        token={userDataFromDatabase.token}
        daily_free_translations={userDataFromDatabase.daily_free_translations}
        paid_tokens={userDataFromDatabase.paid_tokens}
      />
    </>
  );
};

/* session includes name,email,image*/

export default ChatPage;
