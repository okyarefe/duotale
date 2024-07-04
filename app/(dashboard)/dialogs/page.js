import { getStories } from "../../_lib/data-service";
import { currentUser } from "@clerk/nextjs/server";
import Stories from "../../../components/Stories";

const DialogsPage = async () => {
  const user = await currentUser();
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userId = user.id;
  const stories = await getStories(userId);
  console.log("User has this many stories", stories.length);
  return <Stories stories={stories} />;
};
export default DialogsPage;
