import { CustomError } from '@/utils';

const publicEnv = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // Firebase (will be removed gradually)
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

// Skip validation for Supabase keys during migration
const requiredKeys = Object.entries(publicEnv)
  .filter(([key]) => !key.startsWith('SUPABASE_'))
  .filter(([, value]) => !value)
  .map(([key]) => `PUBLIC_ENV.${key}`);

if (requiredKeys.length) {
  throw new CustomError(`Not enough params: ${requiredKeys.join(', ')}`);
}

export const PUBLIC_ENV = publicEnv as Record<keyof typeof publicEnv, string>;

export const IS_DEV = process.env.NODE_ENV === 'development';
