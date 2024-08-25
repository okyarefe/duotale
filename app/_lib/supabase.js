import { createClient } from "@supabase/supabase-js";
import { S3Client } from "@aws-sdk/client-s3";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
const tts_bucket_name = "llearning_bucket";

export const s3_client = new S3Client({
  forcePathStyle: true,
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export const getPublicUrlForMP3 = (fileName) => {
  console.log("The file name go get an URL IS :", fileName);
  const url = supabase.storage.from(tts_bucket_name).getPublicUrl(fileName);
  console.log("URL for the MP3 file:", url);
  return url;
};
