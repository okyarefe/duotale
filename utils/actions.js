"use server";
import "server-only";
import OpenAI from "openai";

import { decreaseUserToken } from "../app/_lib/data-service";

import { currentUser } from "@clerk/nextjs/server";
import { saveStory } from "../app/_lib/data-service";
import { revalidatePath } from "next/cache";

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
  const tokenUsed = response.usage.total_tokens;

  const englishStory = result
    .match(/English:\s*(.*?)\s*Finnish:/s)?.[1]
    ?.trim();
  const finnishStory = result.match(/Finnish:\s*(.*)/s)?.[1]?.trim();

  // console.log("RESPONSE", response);
  try {
    // decrease token count
    const user = await currentUser();
    const userId = user.id;

    // save story to database
    await saveStory(userId, englishStory, finnishStory);
    await decreaseUserToken(userId, tokenUsed);
    revalidatePath("/dialogs");
    return { englishStory, finnishStory, tokenUsed };
  } catch (error) {
    throw new Error("Error saving story to database");
  }
};
