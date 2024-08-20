"use server";
import "server-only";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { generateUniqueId } from "../utils/helper";

const speechFile = path.resolve("./public/speech.mp3");

import { decreaseUserToken } from "../app/_lib/data-service";
import { currentUser } from "@clerk/nextjs/server";
import {
  saveStory,
  saveTTSfileToS3,
  checkIfTTSexistInS3,
  getTTSfileFromS3,
} from "../app/_lib/data-service";
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

  const englishStory = result
    .match(new RegExp(`English:\\s*(.*?)\\s*${translateTo}:`, "s"))?.[1]
    ?.trim();

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
  console.log("THE TEXT TYPE IS ", typeof text);

  // Make a unique name for the file to save in S3bucket
  const uniqueFileName = `${generateUniqueId(text)}.mp3`;
  console.log("UNIQUE FILE NAME", uniqueFileName);

  const doesExist = await checkIfTTSexistInS3(uniqueFileName);
  if (doesExist) {
    console.log("TTS already exist in S3..downloading from S3");
    const existingTTSAudio = await getTTSfileFromS3(uniqueFileName);
    const buffer = Buffer.from(await existingTTSAudio.arrayBuffer());

    await fs.promises.writeFile(speechFile, buffer);
    console.log("Local file updated with the existing TTS file from S3");
    return;
  }

  // Fetch the TTS audio from OpenAI
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });
  console.log("***** MAKING THE REQUEST TO THE OPENAI API *****");

  // Converting the audio to a buffer
  const buffer = Buffer.from(await mp3.arrayBuffer());

  // Save the buffer to Supase storage

  await saveTTSfileToS3(buffer, uniqueFileName);

  //Writing the buffer to a file
  await fs.promises.writeFile(speechFile, buffer);
}
