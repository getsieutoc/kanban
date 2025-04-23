import { extractFileName, getContentType } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/handle-error';
import { Upload } from '@aws-sdk/lib-storage';
import { redis } from '@/lib/redis-client';
import { s3 } from '@/lib/s3-client';
import { nanoid } from '@/lib/utils';
import { getAuth } from '@/auth';

export const dynamic = 'force-dynamic'; // Important for SSE
/*
 * Example usage:
 * -----------------------------------------
  const formData = new FormData();

  for (const file of files) {
    formData.append(fileName, file);
  }

  const response = await fetch('/api/upload', {
    method: HttpMethod.POST,
    body: formData,
  });
 */
export async function POST(req: NextRequest) {
  try {
    const { profile } = await getAuth();

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();

    const entries = formData.entries() as FormDataIterator<[string, File]>;

    const uploadId = nanoid();

    processUploading({ profileId: profile.id, uploadId, entries });

    return NextResponse.json({ uploadId }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(err) },
      { status: 500 }
    );
  }
}

type ProcessUploadingOptions = {
  uploadId: string;
  profileId: string;
  entries: FormDataIterator<[string, File]>;
};
async function processUploading({
  uploadId,
  profileId,
  entries,
}: ProcessUploadingOptions) {
  for (const entry of entries) {
    const [name, file] = entry;

    const { extension } = extractFileName(name);

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const key = `${profileId}/${name}`;

    const params = {
      ContentType: getContentType(extension),
      Bucket: process.env.R2_BUCKET_NAME,
      Body: buffer,
      Key: key,
    };

    const upload = new Upload({
      client: s3,
      params,
      queueSize: 10,
    });

    const redisKey = `upload:${uploadId}:${name}`;

    upload.on('httpUploadProgress', async (event) => {
      if (event.loaded && event.total) {
        const progress = Math.round((event.loaded / event.total) * 100);

        await redis.set(
          redisKey,
          JSON.stringify({
            progress,
            status: 'uploading',
          })
        );
      }
    });

    upload.done().then(async () => {
      await redis.set(
        redisKey,
        JSON.stringify({
          progress: 100,
          status: 'complete',
        })
      );
    });
  }
}