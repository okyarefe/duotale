"use client";

import { useReducer, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateChatResponse } from "../utils/actions";
import ChatForm from "./ChatForm";
import StoryDisplay from "./StoryDisplay";
import { chatReducer, initialState } from "@/app/reducers/chatReducer";

const Chat = ({ token, daily_free_translations, paid_tokens }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    userToken: token,
    userDailyFreeTranslations: daily_free_translations,
    paid_tokens: paid_tokens,
  });

  useEffect(() => {
    const storedEnglishMessage = localStorage.getItem("englishMessage");
    const storedFinnishMessage = localStorage.getItem("finnishMessage");

    if (storedEnglishMessage || storedFinnishMessage) {
      dispatch({
        type: "LOAD_STORIES_FROM_STORAGE",
        payload: {
          englishSentences: storedEnglishMessage
            ? storedEnglishMessage.split(". ")
            : [],
          finnishSentences: storedFinnishMessage
            ? storedFinnishMessage.split(". ")
            : [],
        },
      });
    }
  }, []);

  const handleSubmit = async (text, translateTo) => {
    if (state.userToken > 1000) {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const { englishStory, translatedStory, tokenUsed } =
          await generateChatResponse(text, translateTo);

        dispatch({
          type: "SET_SENTENCES",
          payload: {
            englishSentences: englishStory.split(/(?<=\.)\s/),
            finnishSentences: translatedStory.split(/(?<=\.)\s/),
          },
        });

        localStorage.setItem("englishMessage", englishStory);
        localStorage.setItem("finnishMessage", translatedStory);

        const remaining = state.userToken - tokenUsed;
        dispatch({ type: "SET_TOKENS", payload: state.userToken - tokenUsed });

        toast.success("Your story has been generated!");
        toast.info(`You have used ${tokenUsed} tokens.`);
        toast.info(`You have ${remaining} tokens left.`);
      } catch (error) {
        toast.error("Error occurred while generating the story.");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
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
      />
      <ChatForm
        onSubmit={handleSubmit}
        isLoading={state.isLoading}
        userToken={state.userToken}
        dailyFreeTranslations={state.userDailyFreeTranslations}
        paidTokens={state.paidTokens}
      />
      <StoryDisplay
        isLoading={state.isLoading}
        englishSentences={state.englishSentences}
        finnishSentences={state.finnishSentences}
      />
    </div>
  );
};

export default Chat;
