import { z } from 'zod';

import { LANGUAGE } from '@/constants';

export const createInviteTokenSchema = z.object({
  language: z.nativeEnum(LANGUAGE),
});

export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'message-required')
    .max(2_000, 'message-too-long')
    .trim(),
  receiverId: z.string(),
  receiverLanguage: z.nativeEnum(LANGUAGE),
  senderLanguage: z.nativeEnum(LANGUAGE),
});
