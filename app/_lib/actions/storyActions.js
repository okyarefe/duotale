"use server";
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
