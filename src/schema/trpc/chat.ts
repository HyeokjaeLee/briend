import { z } from 'zod';

import { LANGUAGE } from '@/constants';

export const createInviteTokenSchema = z.object({
  language: z.nativeEnum(LANGUAGE),
});
