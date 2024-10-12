const privateEnv = {
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  AUTH_NAVER_CLIENT_ID: process.env.AUTH_NAVER_CLIENT_ID,
  AUTH_NAVER_SECRET: process.env.AUTH_NAVER_CLIENT_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  DEEPL_API_KEY: process.env.DEEPL_API_KEY,
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
};

for (const key in privateEnv) {
  const _key = key as keyof typeof privateEnv;
  if (!privateEnv[_key]) {
    throw new Error(`${key} is not set`);
  }
}

export const SECRET_ENV = privateEnv as Record<keyof typeof privateEnv, string>;
