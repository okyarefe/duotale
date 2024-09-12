"use client";
import React from "react";
import deleteUser from "../app/_lib/data-service";

const User = ({ users }) => {
  const handleClick = () => {
    try {
      deleteUser({ clerkId: "user_2ly2EepicQBDpowFgG8IcOqA3jx" });
      console.log("Succesfuly deleted the user!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p>{user.id}</p>
        </div>
      ))}
      <button onClick={handleClick}> Delete the User</button>
    </div>
  );
};

export default User;
