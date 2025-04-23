import { CustomError } from '@/utils';

const publicEnv = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const unsetKeys = Object.entries(publicEnv)
  .filter(([, value]) => !value)
  .map(([key]) => `PUBLIC_ENV.${key}`);

if (unsetKeys.length) {
  throw new CustomError(`Not enough params: ${unsetKeys.join(', ')}`);
}

export const PUBLIC_ENV = publicEnv as Record<keyof typeof publicEnv, string>;

export const IS_DEV = process.env.NODE_ENV === 'development';
