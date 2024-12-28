"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateChatResponse } from "../utils/actions";
import ChatForm from "./ChatForm";
import StoryDisplay from "./StoryDisplay";

const Chat = ({ token, daily_free_translations, paid_tokens }) => {
  const [userToken, setUserToken] = useState(token);
  const [userDailyFreeTranslations, setUserDailyFreeTranslations] = useState(
    daily_free_translations
  );
  const [paidTokens, setPaidTokens] = useState(paid_tokens);
  const [englishSentences, setEnglishSentences] = useState([]);
  const [finnishSentences, setFinnishSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEnglishMessage = localStorage.getItem("englishMessage");
    const storedFinnishMessage = localStorage.getItem("finnishMessage");
    if (storedEnglishMessage)
      setEnglishSentences(storedEnglishMessage.split(". "));
    if (storedFinnishMessage)
      setFinnishSentences(storedFinnishMessage.split(". "));
  }, []);

  const handleSubmit = async (text, translateTo) => {
    if (userToken > 1000) {
      setIsLoading(true);
      try {
        const { englishStory, translatedStory, tokenUsed } =
          await generateChatResponse(text, translateTo);
        setEnglishSentences(englishStory.split(". "));
        setFinnishSentences(translatedStory.split(". "));
        localStorage.setItem("englishMessage", englishStory);
        localStorage.setItem("finnishMessage", translatedStory);
        setUserToken((prev) => prev - tokenUsed);
        toast.success("Your story has been generated!");
        toast.info(`You have used ${tokenUsed} tokens.`);
        toast.info(`You have ${userToken - tokenUsed} tokens left.`);
      } catch (error) {
        toast.error("Error occurred while generating the story.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warn("You do not have enough tokens to generate a story.");
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="colored"
      />
      <ChatForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        userToken={userToken}
        dailyFreeTranslations={userDailyFreeTranslations}
        paidTokens={paidTokens}
      />
      <StoryDisplay
        isLoading={isLoading}
        englishSentences={englishSentences}
        finnishSentences={finnishSentences}
      />
    </div>
  );
};

export default Chat;
