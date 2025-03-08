"use server";
const { v4: uuidv4 } = require("uuid");
import { signOut } from "next-auth/react";

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error) {
    throw new Error("Error getting user by email", error);
  }
  return data;
}

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

export const getUsers = async () => {
  "use server";
  let { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    console.log(error);
  }

  return users;
};

export const checkIfUserExists = async (userId) => {
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  return !!user;
};

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

export const deleteUser = async (userData) => {
  const { clerkId } = userData;
  const { error } = await supabase.from("users").delete().eq("id", clerkId);

  if (error) {
    console.log(error);
  }
};

export const signOutButton = async () => {
  signOut({ redirectTo: "/" });
};

export const handleSignIn = async () => {
  console.log("SIGNING IN WITH GOOGLE");

  await signIn("google", { callbackUrl: "/gettokens" });
};
