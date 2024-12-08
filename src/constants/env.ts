import { publicEnvSchema, privateEnvSchema } from '@/utils/env/schema';
import { validateEnv } from '@/utils/env/validate';

const publicEnv = validateEnv(
  publicEnvSchema,
  {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NODE_ENV: process.env.NODE_ENV,
    PUSHER_CLUSTER: 'ap3',
  },
  'PUBLIC_ENV.',
);

const privateEnv = validateEnv(
  privateEnvSchema,
  {
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_NAVER_CLIENT_ID: process.env.AUTH_NAVER_CLIENT_ID,
    AUTH_NAVER_SECRET: process.env.AUTH_NAVER_CLIENT_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    DEEPL_API_KEY: process.env.DEEPL_API_KEY,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    AUTH_KAKAO_APP_KEY: process.env.AUTH_KAKAO_APP_KEY,
    NAVER_CLOUD_CLIENT_ID: process.env.NAVER_CLOUD_CLIENT_ID,
    NAVER_CLOUD_CLIENT_SECRET: process.env.NAVER_CLOUD_CLIENT_SECRET,
    BULY_API_KEY: process.env.BULY_API_KEY,
  },
  'PRIVATE_ENV.',
);

export const ENV = {
  ...publicEnv,
  ...privateEnv,
} as const;

export const IS_DEV = ENV.NODE_ENV === 'development';
