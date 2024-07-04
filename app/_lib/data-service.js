import { supabase } from "./supabase";

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
  console.log("DATA FROM DATABASE", data[0]);
  return data[0].token;
};

export const decreaseUserToken = async (userId, tokenUsed) => {
  const token = await getUserTokenById(userId);
  console.log("TOKEN USED IS", tokenUsed);
  const newToken = token - tokenUsed;
  const { data, error } = await supabase
    .from("users")
    .update({ token: newToken })
    .eq("id", userId)
    .select();
};

export const saveStory = async (userId, englishStory, finnishStory) => {
  const { data, error } = await supabase.from("stories").insert([
    {
      user_id: userId,
      english_story: englishStory,
      finnish_story: finnishStory,
    },
  ]);
  if (error) {
    throw error;
  }
  return data;
};

export const getStories = async (userId) => {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  // console.log("RETURNED STORIES", data);
  return data;
};

export const getStoryById = async (id) => {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};
