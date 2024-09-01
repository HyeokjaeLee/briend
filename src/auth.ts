import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import authConfig from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
});
