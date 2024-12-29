import { useState } from "react";
import Dropdown from "./Dropdown";
import Chooselanguage from "./Chooselanguage";
import { languagesList } from "../utils/helper";
import { Wand2, Sparkles } from "lucide-react";
import ChatPageHeader from "../components/ChatPageHeader";

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
    <div className="bg-slate-200 p-4 rounded-lg shadow-lg border-2 border-indigo">
      <ChatPageHeader></ChatPageHeader>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="flex justify-center items-center gap-4">
          <textarea
            maxLength={100}
            value={text}
            required={true}
            onChange={(e) => setText(e.target.value)}
            className="w-1/2 px-6 py-5 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-16 text-lg text-gray-900"
            placeholder="Enter a topic or theme for your story..."
          />
          <button
            type="submit"
            className="btn btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
            disabled={isLoading}
          >
            <Wand2
              size={24}
              className="group-hover:rotate-12 transition-transform"
            />
          </button>
        </div>
        <div className="text-right text-lg text-indigo-500">
          {text.length}/100 characters
        </div>
        <Chooselanguage translateTo={translateTo}>
          <Dropdown
            label={"Choose a language pair - Translate to "}
            items={languagesList}
            onSelect={languageToTranslate}
          />
        </Chooselanguage>
        <div className="flex gap-6">
          <div className="bg-white px-2 py-4 rounded-xl shadow-md border border-indigo-100 flex items-center">
            <div className="text-gray-600">
              Tokens:{" "}
              <span className="text-xl font-semibold text-indigo-600">
                {userToken}
              </span>
            </div>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-indigo-100 flex items-center">
            <div className="text-sm text-gray-600">
              Free Daily:{" "}
              <span className="text-lg font-semibold text-indigo-600 ml-1">
                {dailyFreeTranslations}
              </span>
            </div>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-indigo-100 flex items-center">
            <div className="text-sm text-gray-600">
              Paid:{" "}
              <span className="text-lg font-semibold text-indigo-600 ml-1">
                {paidTokens}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatForm;
