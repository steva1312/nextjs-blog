
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { extname } from "path";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID!,
    secretAccessKey: process.env.AWS_SECRET_ID!
  }
});

export async function uploadProfilePicture(userId: string, file: File) {
  const timeStamp = new Date().getTime();
  const fileName = `${userId}${timeStamp}${extname(file.name)}`;

  await s3.send(new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `profile-pictures/${fileName}`
  }));

  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `profile-pictures/${fileName}`,
    Body: (await file.arrayBuffer()) as Buffer,
  }));

  const url = `${process.env.AWS_PP_URL}${fileName}`;
  return url;
}