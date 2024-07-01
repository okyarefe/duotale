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
    .insert([{ id: clerkId, email: email }])
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
  console.log("DATA FROM DATABASE", data);
  return data[0].token;
};
