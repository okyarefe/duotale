import { useState } from "react";
import Dropdown from "./Dropdown";
import Chooselanguage from "./Chooselanguage";
import { languagesList } from "../utils/helper";

const ChatForm = ({
  onSubmit,
  isLoading,
  userToken,
  dailyFreeTranslations,
  paidTokens,
}) => {
  const [text, setText] = useState("");
  const [translateTo, setTranslateTo] = useState("Finnish");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text, translateTo);
  };

  const languageToTranslate = (lang) => {
    setTranslateTo(lang);
  };

  return (
    <div className="bg-slate-200 p-4 rounded-lg shadow-lg border-2 border-black">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <textarea
          maxLength={100}
          value={text}
          required={true}
          onChange={(e) => setText(e.target.value)}
          className="textarea textarea-bordered w-full prompt-text-size"
          placeholder="Enter your prompt here..."
        />
        <div className="text-right text-sm text-gray-500">
          {text.length}/100 characters
        </div>
        <Chooselanguage translateTo={translateTo}>
          <Dropdown
            label={"Choose a language pair - Translate to "}
            items={languagesList}
            onSelect={languageToTranslate}
          />
        </Chooselanguage>
        <div className="flex gap-5">
          <h1 className="special border-2 border-black p-2 inline-block">
            You have <span className="color-red-100 text-xl">{userToken}</span>{" "}
            tokens left
          </h1>
          <h1 className="special border-2 border-black p-2 inline-block">
            You have{" "}
            <span className="color-red-100 text-xl">
              {dailyFreeTranslations}
            </span>{" "}
            free daily word translations
          </h1>
          <h1 className="special border-2 border-black p-2 inline-block">
            You have <span className="color-red-100 text-xl">{paidTokens}</span>{" "}
            paid word translations
          </h1>
        </div>
        <button
          type="submit"
          className="btn btn-primary self-end bg-blue-100"
          disabled={isLoading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
