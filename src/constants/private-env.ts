import { CustomError, ERROR } from '@/utils';

const privateEnv = {
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  AUTH_NAVER_CLIENT_ID: process.env.AUTH_NAVER_CLIENT_ID,
  AUTH_NAVER_SECRET: process.env.AUTH_NAVER_CLIENT_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  DEEPL_API_KEY: process.env.DEEPL_API_KEY,
  AUTH_KAKAO_APP_KEY: process.env.AUTH_KAKAO_APP_KEY,
  NAVER_CLOUD_CLIENT_ID: process.env.NAVER_CLOUD_CLIENT_ID,
  NAVER_CLOUD_CLIENT_SECRET: process.env.NAVER_CLOUD_CLIENT_SECRET,
  FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_PRIVATE_KEY_ID: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
};

const unsetKeys = Object.entries(privateEnv)
  .filter(([, value]) => !value)
  .map(([key]) => `PRIVATE_ENV.${key}`);

if (unsetKeys.length) {
  throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(unsetKeys));
}

export const PRIVATE_ENV = privateEnv as Record<
  keyof typeof privateEnv,
  string
>;
