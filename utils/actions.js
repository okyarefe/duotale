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
          "I want to hear the same story in English and Finnish in a daily used vocabulary.In the format of English: [story] Finnish: [story]",
      },
    ],
    max_tokens: 1000,
  });

  const result = response.choices[0].message.content;

  const englishStory = result
    .match(/English:\s*(.*?)\s*Finnish:/s)?.[1]
    ?.trim();
  const finnishStory = result.match(/Finnish:\s*(.*)/s)?.[1]?.trim();

  console.log("RESPONSE", response);
  console.log(response.choices[0].message.content);

  return { englishStory, finnishStory };
};
