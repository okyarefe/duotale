import { getStories } from "../../_lib/data-service";
import { getServerSession } from "next-auth/next";
import Stories from "../../../components/Stories";
import { getUserByEmail } from "../../_lib/data-service";

import { Suspense } from "react";

const DialogsPage = async () => {
  const session = await getServerSession();

  const { id } = await getUserByEmail(session.user.email);
  const paginationStart = 0;
  const paginationEnd = 4;

  const stories = await getStories(id, paginationStart, paginationEnd);

  return (
    <>
      <h1 className="sheading">Stories List</h1>
      <Suspense fallback={<div>...loading</div>}>
        {" "}
        <Stories initialStories={stories} userId={id} />
      </Suspense>
    </>
  );
};
export default DialogsPage;
