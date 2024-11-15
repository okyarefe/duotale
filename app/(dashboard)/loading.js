import React from "react";
import Spinner from "@/components/Spinner";

const loading = () => {
  return (
    <div className="w-full h-[calc(100vh-6rem)] flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default loading;
