import { z } from 'zod';

import { LANGUAGE } from '@/constants';

export const editProfileSchema = z.object({
  language: z.nativeEnum(LANGUAGE),
  displayName: z
    .string()
    .min(1, 'nickname-required')
    .max(20, 'nickname-max-length'),
  photoURL: z.string().optional().nullable(),
});
