"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatResponse = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a dialogue/story teller",
      },
      {
        role: "user",
        content:
          prompt +
          "I want to hear the same story in English and Finnish in a daily used vocabulary.The format should be like this. English:[story itself]. Finnish:[story itself].First give me the English story completely, then same story in Finnish. Do not mix any content !",
      },
    ],
    max_tokens: 950,
  });

  const result = response.choices[0].message.content;
  console.log("RESULT", result);

  const englishStory = result
    .match(/English:\s*(.*?)\s*Finnish:/s)?.[1]
    ?.trim();
  const finnishStory = result.match(/Finnish:\s*(.*)/s)?.[1]?.trim();
  console.log("FINNISH STORY", finnishStory);
  console.log("ENGLISH STORY", englishStory);

  // console.log("RESPONSE", response);

  return { englishStory, finnishStory };
};
