import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT || "https://s3.us-east-005.backblazeb2.com",
  region: process.env.B2_REGION || "us-east-005",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID || "missing_key_id",
    secretAccessKey: process.env.B2_APP_KEY || "missing_app_key",
  },
});

const BUCKET = process.env.B2_BUCKET_NAME || "";

export async function uploadToBackblaze(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  if (!BUCKET || !process.env.B2_KEY_ID || !process.env.B2_APP_KEY) {
    throw new Error("Backblaze B2 credentials are not configured");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);

  // Return public URL (works if bucket is public)
  const endpoint = (process.env.B2_ENDPOINT || "https://s3.us-east-005.backblazeb2.com").replace("https://", "");
  return `https://${BUCKET}.${endpoint}/${fileName}`;
}

export async function getSignedDownloadUrl(fileName: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export { s3, BUCKET };

