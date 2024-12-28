"use client";
import React from "react";
import { useState, useEffect } from "react";

const Chooselanguage = ({ children, translateTo }) => {
  const [translateLang, setTranslateTo] = useState(translateTo);
  useEffect(() => {
    setTranslateTo(translateTo);
  }, [translateTo]);
  return (
    <div className="choose-language w-2/4">
      {children}
      <span className="badge badge-lg badge-ghost bg-black">
        <span className="translate-language">
          {translateLang || "Choose a language"}
        </span>
      </span>
    </div>
  );
};

export default Chooselanguage;
