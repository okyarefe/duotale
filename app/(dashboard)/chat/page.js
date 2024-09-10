import Chat from "../../../components/Chat";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createUserIfNotExists, getUserById } from "../../_lib/data-service";

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
// const user = await currentUser();

// if (!user || !user.id) {
//   console.log("There is no CURRENT USER");
//   return <h1>Not authorized</h1>;
// }
// let userToken = null;
// let daily_free_translations = null;
// const userId = user.id;

// // Check if user exists in database, if not create the user
// /* await createUserIfNotExists(user); */
// try {
//   console.log("CREATE USER IF NOT EXISTS RUN");
//   const X = await createUserIfNotExists(
//     user
//   ); /* If the user exists, this function returns the user and not create a new one IF EXITS- CREATES A NEW USER AND RETURNS IT*/
//   console.log("USER CREATED AFTER CREATE USER IF NOT EXISTS", X);
//   userToken = X.token;
//   daily_free_translations = X.daily_free_translations;
// } catch (error) {
//   console.log("ERROR in createUserIfNotExists", error);
//   throw new Error("createUserIfNotExists failed", error);
// }
