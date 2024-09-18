import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { COOKIES } from './constants/cookies-key';
import { SECRET_ENV } from './constants/secret-env';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn: ({ user: { id, email, image, name } }) => {
      const cookieStore = cookies();

      if (!id || !email || !image || !name) throw new Error('Invalid user');

      const accessToken = sign(
        { id, email, image, name },
        SECRET_ENV.AUTH_SECRET,
        { expiresIn: '2d' },
      );

      cookieStore.set(COOKIES.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 172_800,
      });

      return true;
    },
  },
});
