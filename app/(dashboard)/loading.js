import React from "react";
import Spinner from "@/components/Spinner";

const loading = () => {
  return (
    <div className="flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default loading;
