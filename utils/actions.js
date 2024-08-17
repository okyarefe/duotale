"use server";
import "server-only";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const speechFile = path.resolve("./public/speech.mp3");

import { decreaseUserToken } from "../app/_lib/data-service";
import { currentUser } from "@clerk/nextjs/server";
import { saveStory } from "../app/_lib/data-service";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatResponse = async (prompt, translateTo) => {
  console.log("GENERATING REPONSE!");
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a dialogue/story teller",
      },
      {
        role: "user",
        content: `${prompt} +
          I  want to hear the same story in English and ${translateTo} in a daily used vocabulary.The format should be like this. English:[story itself]. ${translateTo}:[story itself].First give me the English story completely, then same story in ${translateTo}. Do not mix any content!Number of sentences in each translation must be the same and there should be at least 7 sentences.`,
      },
    ],
    max_tokens: 950,
  });

  const result = response.choices[0].message.content;
  // TOTAL TOKENS USED
  const tokenUsed = response.usage.total_tokens;

  // const englishStory = result
  //   .match(/English:\s*(.*?)\s*Finnish:/s)?.[1]
  //   ?.trim();
  const englishStory = result
    .match(new RegExp(`English:\\s*(.*?)\\s*${translateTo}:`, "s"))?.[1]
    ?.trim();

  // const finnishStory = result.match(/Finnish:\s*(.*)/s)?.[1]?.trim();
  // Create dynamic regex patterns
  // const englishRegex = /English:\s*([\s\S]*?)(?=\s*[A-Z][a-z]|$)/s;
  // const englishStory = result.match(englishRegex)?.[1]?.trim();

  const translateRegex = new RegExp(`${translateTo}:\\s*([\\s\\S]*)`, "s");
  const translatedStory = result.match(translateRegex)?.[1]?.trim();

  // Extract stories using the regex patterns

  // console.log("RESPONSE", response);
  try {
    // decrease token count
    const user = await currentUser();
    const userId = user.id;

    // save story to database
    await saveStory(userId, englishStory, translatedStory);
    await decreaseUserToken(userId, tokenUsed);
    revalidatePath("/dialogs");
    return { englishStory, translatedStory, tokenUsed };
  } catch (error) {
    throw new Error(error);
  }
};

export async function fetchAudio(text) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}
