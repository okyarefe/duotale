"use client";
import React from "react";
import { useState } from "react";

const Dropdown = ({ label, items, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item) => {
    const secondLanguage = item.split("-")[1].trim();

    onSelect(secondLanguage);

    setIsOpen(false);
  };
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="dropdown dropdown-hover">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1"
        onClick={handleToggle}
      >
        {label}
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          {items.map((item, index) => {
            return (
              <li key={index} className="menu-item">
                <a onClick={() => handleSelect(item)}>{item}</a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
