import { getStories } from "../../_lib/data-service";
import { auth } from "@clerk/nextjs/server";
import Stories from "../../../components/Stories";

import { Suspense } from "react";

const DialogsPage = async () => {
  const { userId, sessionId } = auth();
  console.log("User id in stories page", userId);
  const paginationStart = 0;
  const paginationEnd = 4;

  const stories = await getStories(userId, paginationStart, paginationEnd);

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
