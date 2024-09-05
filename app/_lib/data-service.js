"use server";
import "server-only";
import { supabase } from "./supabase";

import { currentUser } from "@clerk/nextjs/server";
import { saveFileUrlToRedis } from "./redis";

export const getUsers = async () => {
  let { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    console.log(error);
  }

  return users;
};

export const createUser = async (userData) => {
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

export const deleteUser = async (userData) => {
  const { clerkId } = userData;
  const { error } = await supabase.from("users").delete().eq("id", clerkId);

  if (error) {
    console.log(error);
  }
};

export const getUserTokenById = async (userId) => {
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

  console.log("SAVING FILE TO BUCKKET", data);

  await saveFileUrlToRedis(fileName, data.path);

  if (error) {
    console.log("ERROR SAVING FILE TO S3", error);
    throw new Error("Failed to upload audio to supabase stroage");
  }

  return data;
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
