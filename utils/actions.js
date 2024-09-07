"use server";
import "server-only";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { generateUniqueId } from "../utils/helper";
import { getPublicUrlForMP3 } from "../app/_lib/supabase";
const speechFile = path.resolve("./public/speech.mp3");
import { getValueFromCache } from "../app/_lib/redis";
import { decreaseUserToken } from "../app/_lib/data-service";
import { currentUser } from "@clerk/nextjs/server";
import {
  saveStory,
  saveTTSfileToS3,
  checkIfTTSexistInS3,
  getTTSfileFromS3,
} from "../app/_lib/data-service";
import { revalidatePath } from "next/cache";
const textToSpeech = require("@google-cloud/text-to-speech");
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
import { franc } from "franc";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatResponse = async (prompt, translateTo) => {
  console.log("GENERATING REPONSE!");
  const response = await openai.chat.completions.create({
    // model: "gpt-3.5-turbo",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a dialogue/story teller",
      },
      {
        role: "user",
        content: `${prompt} +
          I  want to hear the same story in English and ${translateTo} in a daily used vocabulary.The format should be like this. English:[story itself]. ${translateTo}:[story itself].First give me the English story completely, then same story in ${translateTo}. Do not mix any content!Number of sentences in each translation must be the same and there should be at least 7 sentences.Do not include any ** in your sentences`,
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
  // Make a unique name for the file to save in S3bucket
  const uniqueFileName = `${generateUniqueId(text)}.mp3`;

  const doesTTSexistsInCache = await getValueFromCache(uniqueFileName);

  if (doesTTSexistsInCache.exists === true) {
    console.log("TTS already exist in Redis..Forming URL link");

    // const supabaseBucketUrl = process.env.S3_ENDPOINT;
    const signedUrl = doesTTSexistsInCache.urlCache;
    // console.log("SIGNED URL", signedUrl);

    return signedUrl;
  } else {
    const doesExist = await checkIfTTSexistInS3(uniqueFileName);

    if (doesExist) {
      console.log("TTS already exist in S3..downloading from S3");
      const existingTTSAudio = await getTTSfileFromS3(uniqueFileName);
      const buffer = Buffer.from(await existingTTSAudio.arrayBuffer());

      await fs.promises.writeFile(speechFile, buffer);
      console.log("Local file updated with the existing TTS file from S3");
      return;
    }
  }

  console.log(
    "000000000000  MAKING  API   REQUEST   TO  TEXT TO SPEECH 0000000000000"
  );

  const francToGoogleLangMap = {
    eng: "en-US", // English
    spa: "es-ES", // Spanish
    fra: "fr-FR", // French
    deu: "de-DE", // German
    ita: "it-IT", // Italian
    fin: "fi-FI", // Finnish
    // Add more mappings as needed
  };

  function detectLanguage(text) {
    const langCode = franc(text);
    // console.log("Detected Language Code:", langCode);

    return francToGoogleLangMap[langCode] || "en-US";
  }
  const languageCode = detectLanguage(text);
  console.log("Language Code:", languageCode);

  const request = {
    input: { text: text },
    voice: {
      languageCode: languageCode,
      ssmlGender: "NEUTRAL",
    },
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the Text-to-Speech request
  const [response] = await client.synthesizeSpeech(request);

  // Convert the response audio content to a buffer
  const buffer = Buffer.from(response.audioContent, "binary");

  //  Save the buffer to Supase storage
  await saveTTSfileToS3(buffer, uniqueFileName);

  // Write the buffer to a file in the public directory
  await fs.promises.writeFile(speechFile, buffer);
}

export const fetchTranslateWord = async (word) => {
  console.log("TRANSLATING WORD FROM OPEN AI", word);
  try {
    const response = await openai.chat.completions.create({
      // model: "gpt-3.5-turbo",
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a dictionary",
        },
        {
          role: "user",
          content: `What does ${word} mean in English? just write the answer
         `,
        },
      ],
      max_tokens: 20,
    });

    const wordTranslation = response.choices[0].message.content;

    const tokenUsed = response.usage.total_tokens;
    console.log("Translating word" + wordTranslation + "costed" + tokenUsed);
    return { wordTranslation, tokenUsed };
  } catch (error) {
    // console.log("ERROR TRANSLATING WORD", error);
    throw new Error(error);
  }
};
