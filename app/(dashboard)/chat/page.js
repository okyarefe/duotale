import Chat from "../../../components/Chat";
import { currentUser } from "@clerk/nextjs/server";
import {
  getUserTokenById,
  createUserIfNotExists,
  getUserById,
} from "../../_lib/data-service";

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
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", X);
    userToken = X.token;
    daily_free_translations = X.daily_free_translations;
    console.log("userToken", userToken);
    console.log("daily_free_translations", daily_free_translations);
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
// let userDataFromDatabase = await getUserById(userId);

// Implement a retry mechanism with a maximum number of attempts

// Check if user exists in database, if not create the user
// const maxAttempts = 5;
// const retryDelay = 1000; // 1 second
// for (let attempt = 0; attempt < maxAttempts; attempt++) {
//   if (userDataFromDatabase) break;

//   console.log(`Retrying... (Attempt ${attempt + 1}/${maxAttempts})`);
//   await new Promise((resolve) => setTimeout(resolve, retryDelay));
//   userDataFromDatabase = await getUserById(userId);
// }
