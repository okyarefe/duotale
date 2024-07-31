// app/chat/page.tsx or page.js
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
    console.log("USER CURRENTLY HAS TOKEN:", userToken);

    if (!userToken) {
      return <h1>User token not found</h1>;
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

// import Chat from "../../../components/Chat";
// import { currentUser } from "@clerk/nextjs/server";
// import { getUserTokenById } from "../../_lib/data-service";

// const ChatPage = async () => {
//   // get user id
//   const user = await currentUser();
//   const userId = user.id;
//   console.log("CURRENT USER ID", userId);
//   if (!userId) return <h1>Not authorized</h1>;

//   const userToken = await getUserTokenById(userId);

//   // if (!userTokenObj || userTokenObj.length === 0 || !userTokenObj[0].token) {
//   //   console.error("Token not found for user ID:", userId);
//   //   return <h1>User token not found</h1>;
//   // }

//   return (
//     <div>
//       <Chat token={userToken} userId={userId}></Chat>
//     </div>
//   );
// };

// export default ChatPage;
