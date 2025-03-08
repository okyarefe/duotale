"use server";
import "server-only";
import { supabase } from "../supabase";
import { saveFileUrlToRedis } from "../redis";

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
