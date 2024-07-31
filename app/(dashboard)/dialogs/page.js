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
  console.log("Number of stories in the database:", stories.length);

  return (
    <>
      <h1 className="sheading">Stories List</h1>
      <Suspense fallback={<div>...loading</div>}>
        {" "}
        <Stories initialStories={stories} userId={userId} />
      </Suspense>
    </>
  );
};
export default DialogsPage;
