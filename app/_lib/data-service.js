"use server";
import "server-only";
import { supabase } from "./supabase";

import { currentUser } from "@clerk/nextjs/server";
import { saveFileUrlToRedis } from "./redis";

export const getUsers = async () => {
  "use server";
  let { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    console.log(error);
  }

  return users;
};

export const deleteUser = async (userData) => {
  "use server";
  const { clerkId } = userData;
  const { error } = await supabase.from("users").delete().eq("id", clerkId);

  if (error) {
    console.log(error);
  }
};

export const getUserTokenById = async (userId) => {
  "use server";
  // The getUserTokenById function looks mostly correct, but we can improve it:
  // 1. Add error handling for when no user is found
  // 2. Use optional chaining to safely access the token
  // 3. Return null if there's an error or no user found
  // Here's an improved version:

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
      console.log("No user found with id:", userId);
      return null;
    }

    const token = data.token;
    console.log("Token retrieved:", token);
    return token;
  } catch (error) {
    console.log("ERROR", error);
    return null;
  }
};

export const decreaseUserToken = async (userId, tokenUsed) => {
  "use server";
  const token = await getUserTokenById(userId);
  console.log("USER TOKEN", token);
  console.log("TOKEN USED", tokenUsed);

  const newToken = token - tokenUsed;
  console.log("REMANING TOKENS", newToken);
  const { data, error } = await supabase
    .from("users")
    .update({ token: newToken })
    .eq("id", userId)
    .select();
};

export const saveStory = async (userId, englishStory, finnishStory) => {
  "use server";
  console.log("Saved story to database");

  const { data, error } = await supabase.from("stories").insert([
    {
      user_id: userId,
      english_story: englishStory,
      finnish_story: finnishStory,
    },
  ]);
  if (error) {
    console.log("ERROR SAVING STORY TO DATABASE", error);
    throw new Error("ERROR SAVING STORY TO DATABASE");
  }

  return data;
};

export const getStories = async (userId, paginationStart, paginationEnd) => {
  "use server";
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

export const getStoryById = async (id) => {
  "use server";
  const user = await currentUser();
  const userId = user.id;
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const checkIfUserExists = async (userId) => {
  "use server";
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  return !!user;
};

export const saveTTSfileToS3 = async (buffer, fileName) => {
  "use server";
  const { data, error } = await supabase.storage
    .from("llearning_bucket")
    .upload(fileName, buffer, {
      contentType: "audio/mpeg",
    });

  console.log("SAVING FILE TO BUCKKET", data);

  await saveFileUrlToRedis(fileName, data.path);

  if (error) {
    console.log("ERROR SAVING FILE TO S3", error);
    throw new Error("Failed to upload audio to supabase stroage");
  }

  return data;
};

export const checkIfTTSexistInS3 = async (fileName) => {
  "use server";
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
  "use server";
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
  console.log("USER ID IN DAILYYYYYYYY", userId);
  try {
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("daily_free_translations")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user:", fetchError);
      return { status: failed, message: "Error fetching user data" };
    }

    if (!data) {
      return { status: failed, message: "User does not exist" };
    }
    return data;
  } catch (error) {
    console.log("ERROR FETCHING DAILY LIMIT", error);
  }

  console.log("DATA AT FETCH DAILY TRANSLATION LIMIT", data);
};

export const decreaseWordTranslationLimitByOne = async (userId) => {
  const { daily_free_translations } = await fetchDailyTranslationLimit(userId);
  console.log("Daily translation left : ", daily_free_translations);

  if (daily_free_translations < 1) {
    console.log("User does not have any daily translation left to proceed");
    return {
      status: "failed",
      message: " You have 0 remaining daily translation",
    };
  }
  const newCurrentDailyLimit = daily_free_translations - 1;
  const { error: updateError } = await supabase
    .from("users")
    .update({ daily_free_translations: newCurrentDailyLimit })
    .eq("id", userId);
  if (updateError) {
    console.log("Error updating tokens", updateError);
    return { status: "failed", message: "Error updating daily limit" };
  }

  return { status: "success", message: "Updated limit successfully." };
};

/*  USER RELETED FUNCTIONS */

export const createUserIfNotExists = async (user) => {
  "use server";
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

export const createUser = async (userData) => {
  "use server";
  console.log("USER DATA FROM WEB HOOKS", userData);
  let clerkId, email;

  if (userData.id) {
    // Handle the case when userData is a Clerk User object
    clerkId = userData.id;
    email = userData.emailAddresses[0].emailAddress;
  } else {
    // Handle the case when userData is the simplified object
    clerkId = userData.clerkId;
    email = userData.email;
  }

  const { data, error } = await supabase
    .from("users")
    .insert([{ id: clerkId, token: 5000, email: email }])
    .select();

  if (error) {
    console.error("ERROR CREATING USER TO DATABASE", error);
    throw new Error("ERROR CREATING USER TO DATABASE");
  }
  console.log("User Created in Supabase", data);
  return data;
};

export const getUserById = async (userId) => {
  "use server";

  try {
    let { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("ERROR GETTING USER BY ID", error);
      return null;
    }
    if (!data) {
      console.log("No user found with id:", userId);
      return null;
    }
    console.log("DATA AT SUPA LIB SERVICE", data);
    return data;
  } catch (error) {
    console.log("ERROR", error);
    return null;
  }
};
