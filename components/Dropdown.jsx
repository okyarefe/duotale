"use client";
import React, { useState } from "react";

const Dropdown = ({ label, items, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item) => {
    const secondLanguage = item.split("-")[1].trim();
    onSelect(secondLanguage);
    setIsOpen(false);
  };

  return (
    <div
      className="dropdown dropdown-hover group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        tabIndex={0}
        role="button"
        className="w-full bg-white px-6 py-4 rounded-xl shadow-md border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-between"
      >
        {label}
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-white rounded-xl z-[1] w-full p-2 shadow-lg border border-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {items.map((item, index) => (
            <li key={index}>
              <a
                onClick={() => handleSelect(item)}
                className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
