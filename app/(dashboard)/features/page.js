import Link from "next/link";
import React from "react";

const FeaturesPage = () => {
  return (
    <div className="bg-cyan-50">
      <Link
        href="/"
        className="flex items-center justify-center"
        prefetch={false}
      ></Link>
    </div>
  );
};

export default FeaturesPage;
