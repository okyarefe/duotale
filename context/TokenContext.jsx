"use client";
// context/TokenContext.js
import { createContext, useContext, useState, useEffect } from "react";

import { getUserById } from "../app/_lib/data-service";
import { useAuth } from "@clerk/nextjs";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userDailyTranslation, setUserDailyTranslation] = useState(null);

  const { userId } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("fetching for context");
        const userData = await getUserById(userId);
        const token = userData.token;
        const userDailyLimit = userData.daily_free_translations;
        /*I AM HERE */
        setUserToken(token);
        setUserDailyTranslation(userDailyLimit);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error
      }
    };

    fetchUserData();
  }, [userId]); // Fetch data on route change
  const updateToken = (amount) => {
    setUserToken((prevToken) => {
      const newToken = prevToken - amount;
      // Trigger any additional side effects here, e.g., refetch data
      return newToken;
    });
  };

  return (
    <TokenContext.Provider
      value={{
        userToken,
        setUserToken,
        userDailyTranslation,
        setUserDailyTranslation,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => useContext(TokenContext);
