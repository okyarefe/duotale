"use server";
import "server-only";
import { supabase } from "./supabase";
import NodeCache from "node-cache";
import { currentUser } from "@clerk/nextjs/server";
import { clear } from "console";
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
    console.log(error);
  }

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
  const { data, error } = await supabase
    .from("users")
    .select("token")
    .eq("id", userId);

  if (error) throw error;

  return data[0].token;
};

export const decreaseUserToken = async (userId, tokenUsed) => {
  const token = await getUserTokenById(userId);

  const newToken = token - tokenUsed;
  const { data, error } = await supabase
    .from("users")
    .update({ token: newToken })
    .eq("id", userId)
    .select();
};

export const saveStory = async (userId, englishStory, finnishStory) => {
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
  const cacheKey = `${userId}-${paginationStart}-${paginationEnd}`;
  const cachedStories = cache.get(cacheKey);

  if (cachedStories) {
    console.log("***** RETURNING CACHED STORIES *****");
    return cachedStories;
  }

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
    console.log("***** STORIES FROM DATABASE *****");
    cache.set(cacheKey, data);

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
