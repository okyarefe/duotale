"use server";
import { revalidatePath } from "next/cache";
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
    throw new Error("Failed to decrease token count");
  }
};

export const fetchDailyTranslationLimit = async (userId) => {
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
    throw new Error("Failed fetching daily transition limit", error);
  }
};

export const decreaseWordTranslationLimitByOne = async (userId) => {
  const { daily_free_translations, paid_tokens, total_tokens } =
    await fetchDailyTranslationLimit(userId);

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
};

export const getPackage = async (packageName) => {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("name", packageName)
    .single();

  if (error) {
    return null;
  }

  return data;
};
