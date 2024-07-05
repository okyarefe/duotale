import { getStories } from "../../_lib/data-service";
import { currentUser } from "@clerk/nextjs/server";
import Stories from "../../../components/Stories";
import { Suspense } from "react";

const DialogsPage = async () => {
  const user = await currentUser();
  const paginationStart = 0;
  const paginationEnd = 4;
  const userId = user.id;
  const stories = await getStories(userId, paginationStart, paginationEnd);
  console.log("User has this many stories", stories.length);

  return (
    <>
      <h1>Stories List</h1>
      <Suspense fallback={<div>FALLBACK</div>}>
        {" "}
        <Stories stories={stories} userId={userId} />
      </Suspense>
    </>
  );
};
export default DialogsPage;
