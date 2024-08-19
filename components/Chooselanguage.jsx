"use client";
import React from "react";
import { useState, useEffect } from "react";

const Chooselanguage = ({ children, translateTo }) => {
  const [translateLang, setTranslateTo] = useState(translateTo);
  useEffect(() => {
    setTranslateTo(translateTo);
  }, [translateTo]);
  return (
    <div className="choose-language">
      {children}
      <span className="badge badge-lg badge-ghost">
        {" "}
        <span className="translate-language">
          {translateLang || "Choose a language"}
        </span>
      </span>
    </div>
  );
};

export default Chooselanguage;
