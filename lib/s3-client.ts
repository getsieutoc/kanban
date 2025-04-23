import { S3Client } from '@aws-sdk/client-s3';

const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const ENDPOINT = process.env.R2_ENDPOINT!;

export const s3 = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});
