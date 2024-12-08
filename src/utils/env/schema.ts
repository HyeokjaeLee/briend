import { z } from 'zod';

export const publicEnvSchema = z.object({
  BASE_URL: z.string().url(),
  PUSHER_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PUSHER_CLUSTER: z.literal('ap3'),
});

export const privateEnvSchema = z.object({
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  AUTH_NAVER_CLIENT_ID: z.string().min(1),
  AUTH_NAVER_SECRET: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  DEEPL_API_KEY: z.string().min(1),
  PUSHER_APP_ID: z.string().min(1),
  PUSHER_SECRET: z.string().min(1),
  AUTH_KAKAO_APP_KEY: z.string().min(1),
  NAVER_CLOUD_CLIENT_ID: z.string().min(1),
  NAVER_CLOUD_CLIENT_SECRET: z.string().min(1),
  BULY_API_KEY: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type PrivateEnv = z.infer<typeof privateEnvSchema>;
