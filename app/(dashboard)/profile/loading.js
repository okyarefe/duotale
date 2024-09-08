import React from "react";
import { CircleLoader } from "react-spinners";

const loading = () => {
  return (
    <div className="loader-container">
      <CircleLoader />
    </div>
  );
};

export default loading;
