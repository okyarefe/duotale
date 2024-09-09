import Chat from "../../../components/Chat";
import { currentUser } from "@clerk/nextjs/server";
import { createUserIfNotExists } from "../../_lib/data-service";

const ChatPage = async () => {
  const user = await currentUser();

  if (!user || !user.id) {
    console.log("There is no CURRENT USER");
    return <h1>Not authorized</h1>;
  }
  let userToken = null;
  let daily_free_translations = null;
  const userId = user.id;

  // Check if user exists in database, if not create the user
  /* await createUserIfNotExists(user); */
  try {
    const X = await createUserIfNotExists(
      user
    ); /* If the user exists, this function returns the user and not create a new one IF EXITS- CREATES A NEW USER AND RETURNS IT*/

    userToken = X.token;
    daily_free_translations = X.daily_free_translations;
  } catch (error) {
    console.log("ERROR in createUserIfNotExists", error);
    throw new Error("createUserIfNotExists failed", error);
  }

  return (
    <div>
      <Chat
        token={userToken}
        daily_free_translations={daily_free_translations}
      />
    </div>
  );
};

export default ChatPage;
