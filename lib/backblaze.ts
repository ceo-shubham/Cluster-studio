import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT!,
  region: process.env.B2_REGION ?? "us-east-005",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  },
});

const BUCKET = process.env.B2_BUCKET_NAME!;

export async function uploadToBackblaze(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);

  // Return public URL (works if bucket is public)
  const endpoint = process.env.B2_ENDPOINT!.replace("https://", "");
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
