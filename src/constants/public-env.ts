import { CustomError, ERROR } from '@/utils';

const publicEnv = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  //TODO: 삭제 필요 PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  NODE_ENV: process.env.NODE_ENV,
};

const unsetKeys = Object.entries(publicEnv)
  .filter(([, value]) => !value)
  .map(([key]) => `PUBLIC_ENV.${key}`);

if (unsetKeys.length) {
  throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(unsetKeys));
}

export const PUBLIC_ENV = publicEnv as Record<keyof typeof publicEnv, string>;

export const IS_DEV = process.env.NODE_ENV === 'development';
