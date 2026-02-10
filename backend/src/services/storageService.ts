import { Storage } from '@google-cloud/storage';
import { config } from '../config';

const storage = new Storage();
const bucket = storage.bucket(config.storageBucket);

export const generateSignedUploadUrl = async (
  filePath: string,
  contentType: string
): Promise<{ signedUrl: string; publicUrl: string }> => {
  const file = bucket.file(filePath);

  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  const publicUrl = `https://storage.googleapis.com/${config.storageBucket}/${filePath}`;

  return { signedUrl, publicUrl };
};
