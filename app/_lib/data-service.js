"use server";
import "server-only";
import { supabase } from "./supabase";
import NodeCache from "node-cache";
import { currentUser } from "@clerk/nextjs/server";

const cache = new NodeCache({ stdTTL: 600 }); // Cache TTL set to 10 minutes

export const getUsers = async () => {
  let { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    console.log(error);
  }

  return users;
};

export const createUser = async (userData) => {
  const { clerkId, email } = userData;
  const { data, error } = await supabase
    .from("users")
    .insert([{ id: clerkId, email: email, token: 5000 }])
    .select();

  if (error) {
    console.log("ERROR CREATING USER");
    console.log(error);
  }
  console.log("User Created", data);
  return data;
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
      .eq("id", userId);

    // console.log("***** DATA TOKEN FROM DATABASE *****", data);
    const token = data[0].token;
    // console.log("------TOKE-------", token);
    return token;
  } catch (error) {
    console.log("ERROR", error);
  }
};

export const decreaseUserToken = async (userId, tokenUsed) => {
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
  console.log("Saved story to database");

  try {
    const { data, error } = await supabase.from("stories").insert([
      {
        user_id: userId,
        english_story: englishStory,
        finnish_story: finnishStory,
      },
    ]);
  } catch (error) {
    throw new Error("FAILED TO SAVE STORY");
  }
};

export const getStories = async (userId, paginationStart, paginationEnd) => {
  // const cacheKey = `${userId}-${paginationStart}-${paginationEnd}`;
  // const cachedStories = cache.get(cacheKey);

  // if (cachedStories) {
  //   console.log("***** RETURNING CACHED STORIES *****");
  //   return cachedStories;
  // }

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
    // console.log("***** STORIES FROM DATABASE *****");
    // cache.set(cacheKey, data);

    return data;
  } catch (error) {
    throw new Error("FAILED TO GET USER STORIES");
  }
};

export const getStoryById = async (id) => {
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

export const createUserIfNotExists = async (user) => {
  const { id: userId, email: email } = user;

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (!existingUser) {
    await createUser(user);
  }
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
  const { data, error } = await supabase.storage
    .from("llearning_bucket")
    .upload(fileName, buffer, {
      contentType: "audio/mpeg",
    });

  if (error) {
    console.log("ERROR SAVING FILE TO S3", error);
    throw new Error("Failed to upload audio to supabase stroage");
  }
  console.log("FILE SAVED TO S3", data);
  return data;
};

export const checkIfTTSexistInS3 = async (fileName) => {
  try {
    // List the files in the bucket or folder
    const { data, error } = await supabase.storage
      .from("llearning_bucket")
      .list("", {
        search: fileName, // Optional: search by specific file name
      });

    if (error) {
      console.error("Error listing files in bucket:", error);
      return false; // If there's an error, assume file doesn't exist
    }

    // Check if the specific file is in the list
    const fileExists = data.some((file) => file.name === fileName);

    if (fileExists) {
      console.log("File exists in S3 bucket:", fileName);
      return true;
    } else {
      console.log("File does not exist in S3 bucket:", fileName);
      return false;
    }
  } catch (error) {
    console.error("Error checking file existence in S3 bucket:", error);
    return false; // Handle other potential errors
  }
};
