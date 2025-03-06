"use server";
import "server-only";
import { supabase } from "./supabase";
const { v4: uuidv4 } = require("uuid");

// import { currentUser } from "@clerk/nextjs/server";
import { saveFileUrlToRedis } from "./redis";
import { signOut } from "next-auth/react";
import { revalidatePath } from "next/cache";

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  return data;
}

export const getPackage = async (packageName) => {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("name", packageName)
    .single();

  if (error) {
    console.log("ERROR GETTING PACKAGE", error);
    return null;
  }

  return data;
};

export const updateUserCreditsBasicPackage = async (userId) => {
  const tokensToAdd = 5000;
  const paidTokensToAdd = 50;
  console.log("*********************************", userId);

  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("token, paid_tokens")
    .eq("id", userId)
    .select()
    .single();

  if (fetchError) {
    console.log("Error Getting user tokens", error);
    return null;
  }
  // Calculate new token values
  console.log("USER DATA GATTERS", user);
  const newTokens = user.token + tokensToAdd;
  const newPaidTokens = user.paid_tokens + paidTokensToAdd;

  const { error: updateError } = await supabase
    .from("users")
    .update({ token: newTokens, paid_tokens: newPaidTokens })
    .eq("id", userId);

  if (updateError) {
    throw new Error(`Error updating user tokens: ${updateError.message}`);
  }

  console.log(
    `Successfully updated user ${userId} with ${tokensToAdd} tokens and ${paidTokensToAdd} paid tokens.`
  );
};

export const createUser = async (email) => {
  const id = uuidv4();
  const { data, error } = await supabase
    .from("users")
    .insert([
      { id: id, token: 5000, email: email, daily_free_translations: 50 },
    ])
    .select();

  if (error) {
    console.error("ERROR CREATING USER TO DATABASE", error);
    throw new Error("ERROR CREATING USER TO DATABASE");
  }
  console.log("User created & returned from supabase succesfully", data);

  return data;
};

export const signOutButton = async () => {
  signOut({ redirectTo: "/" });
};

export const handleSignIn = async () => {
  console.log("SIGNING IN WITH GOOGLE");

  await signIn("google", { callbackUrl: "/gettokens" });
};

export const getUsers = async () => {
  "use server";
  let { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    console.log(error);
  }

  return users;
};

export const deleteUser = async (userData) => {
  const { clerkId } = userData;
  const { error } = await supabase.from("users").delete().eq("id", clerkId);

  if (error) {
    console.log(error);
  }
};

export const getUserTokenById = async (userId) => {
  console.log("GETTING USER TOKEN BY ID");
  try {
    const { data, error } = await supabase
      .from("users")
      .select("token")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("ERROR", error);
      return null;
    }

    if (!data) {
      return null;
    }

    const token = data.token;

    return token;
  } catch (error) {
    throw new Error("Failed to get user token by id", error);
  }
};

export const decreaseUserToken = async (userId, tokenUsed) => {
  const token = await getUserTokenById(userId);

  if (token < tokenUsed) {
    throw new Error("Token used is greater than the user's token count");
  }
  const newToken = token - tokenUsed;
  console.log("Remaining", newToken);
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ token: newToken })
      .eq("id", userId)
      .select();
    if (error) {
      throw new Error("No user");
    }
    revalidatePath("/chat");
  } catch (error) {
    console.log("ERROR DECREASING TOKEN", error);
    throw new Error("Failed to decrease token count");
  }
};

export const saveStory = async (
  userId,
  englishStory,
  translatedStory,
  translateTo
) => {
  try {
    const { data, error } = await supabase.from("stories").insert([
      {
        user_id: userId,
        english_story: englishStory,
        translated_story: translatedStory,
        translate_to: translateTo,
      },
    ]);
    if (error) {
      throw new Error(
        `Supabase returned an error while saving story: ${error.message}`
      );
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to save story to database: ${error.message}`);
  }
};

export const getStories = async (userId, paginationStart, paginationEnd) => {
  try {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .range(paginationStart, paginationEnd)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("FAILED TO GET USER STORIES");
    }

    return data;
  } catch (error) {
    throw new Error("FAILED TO GET USER STORIES");
  }
};

export const getStoryById = async (storyId) => {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("id", storyId)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const checkIfUserExists = async (userId) => {
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  return !!user;
};

export const saveTTSfileToS3 = async (buffer, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from("llearning_bucket")
      .upload(fileName, buffer, {
        contentType: "audio/mpeg",
      });

    if (error) {
      console.error("ERROR SAVING FILE TO S3", error);
      throw new Error(error.message || "Error saving TTS to S3");
    }

    await saveFileUrlToRedis(fileName, data.path);

    return data;
  } catch (error) {
    console.error("Caught error in saveTTSfileToS3:", error);
    throw new Error(error.message || "Error saving TTS to S3");
  }
};

export const checkIfTTSexistInS3 = async (fileName) => {
  console.log("CHECKING S3 STORAGE - - - - ");
  try {
    // List the files in the bucket or folder
    const { data, error } = await supabase.storage
      .from("llearning_bucket")
      .list("", {
        search: fileName,
      });

    if (error) {
      console.error("Error listing files in bucket:", error);
      return false; // If there's an error, assume file doesn't exist
    }

    // Check if the specific file is in the list
    const fileExists = data.some((file) => file.name === fileName);

    if (fileExists) {
      console.log("File exists in S3 bucket:");
      return true;
    } else {
      console.log("File does not exist in S3 bucket");
      return false;
    }
  } catch (error) {
    console.error("Error checking file existence in S3 bucket:", error);
    return false; // Handle other potential errors
  }
};

export const getTTSfileFromS3 = async (fileName) => {
  const { data, error } = await supabase.storage
    .from("llearning_bucket")
    .download(fileName);

  if (error) {
    console.error("Error downloading file from S3:", error);
    throw error;
  }

  return data;
};

export const saveWordToLocalStorage = async (word) => {
  "use server";
};

export const fetchDailyTranslationLimit = async (userId) => {
  console.log("Gathering daily translation limit for user:", userId);
  try {
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("daily_free_translations,paid_tokens,total_tokens")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user daily translation limit:", fetchError);
      return { status: failed, message: "Error fetching user data" };
    }

    if (!data) {
      return {
        status: failed,
        message: "User does not exist in daily translation limit",
      };
    }
    return data;
  } catch (error) {
    console.log("ERROR FETCHING DAILY LIMIT", error);
  }

  console.log("DATA AT FETCH DAILY TRANSLATION LIMIT", data);
};

export const decreaseWordTranslationLimitByOne = async (userId) => {
  const { daily_free_translations, paid_tokens, total_tokens } =
    await fetchDailyTranslationLimit(userId);
  console.log("Daily translation left : ", daily_free_translations);
  console.log("Paid tokens left : ", paid_tokens);
  console.log("Total tokens left : ", total_tokens);

  if (total_tokens < 1) {
    console.log("User does not have any daily translation left to proceed");
    return {
      status: "failed",
      message: " You have 0 remaining daily translation",
    };
  }
  let upDateData = {};

  if (daily_free_translations > 0) {
    upDateData.daily_free_translations = daily_free_translations - 1;
  } else if (paid_tokens > 0) {
    upDateData.paid_tokens = paid_tokens - 1;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update(upDateData)
    .eq("id", userId);
  if (updateError) {
    console.log("Error updating tokens", updateError);
    return { status: "failed", message: "Error updating daily limit" };
  }

  return { status: "success", message: "Updated limit successfully." };
};

/*  USER RELETED FUNCTIONS */

export const createUserIfNotExists = async (user) => {
  const { id: userId, email: email } = user;

  try {
    const existingUser = await getUserById(userId);

    if (!existingUser) {
      try {
        const newlyCreatedUser = await createUser(user);
        console.log("Newly created user", newlyCreatedUser);
        return newlyCreatedUser;
      } catch (error) {
        throw new Error("createUser failed", error);
      }
    } else {
      console.log("User already exists", existingUser);
      return existingUser;
    }
  } catch (error) {
    throw new Error("createUserIfNotExists failed", error);
  }
};

export const getUserById = async (userId) => {
  try {
    let { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("Error querying user from database", error);
      return null;
    }
    if (!data) {
      console.log("No user found with id:", userId);
      return null;
    }

    return data;
  } catch (error) {
    console.log("Error querying data from database", error);
    return null;
  }
};
