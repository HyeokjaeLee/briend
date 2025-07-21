import { supabase } from '@/database/supabase/client';

import { CustomError } from '../customError';

const PATHS = {
  profileImage: (userId: string) => `users/${userId}/profile`,
  chatFiles: (userId: string, messageId: string) => `chats/${userId}/${messageId}`,
};

interface UploadSupabaseStorageInput {
  file: File;
  path: (paths: typeof PATHS) => string;
  bucket?: string;
}

export const uploadSupabaseStorage = async ({
  file,
  path,
  bucket = 'briend-storage',
}: UploadSupabaseStorageInput) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const fullPath = [path(PATHS), extension].join('.');

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true, // Replace if exists
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath);

    return publicUrl;
  } catch (e) {
    throw new CustomError({
      message: `Failed to upload file: ${fullPath}`,
      cause: String(e),
    });
  }
};