import { omit } from 'es-toolkit';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';

import { LANGUAGE } from '@/constants';
import { COOKIES } from '@/constants/cookies';
import { LOGIN_PROVIDERS } from '@/constants/etc';
import { PRIVATE_ENV } from '@/constants/private-env';
import { assert, assertEnum, customCookies } from '@/utils';

import { getUserSession } from './getUserSession';
import { linkAccount } from './linkAccount';
import { updateSession } from './updateSession';

export interface SessionDataToUpdate {
  unlinkedProvider?: LOGIN_PROVIDERS;
  updatedProfile?: {
    nickname: string;
  };
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  providers: [
    Google,
    Naver({
      clientId: PRIVATE_ENV.AUTH_NAVER_CLIENT_ID,
      clientSecret: PRIVATE_ENV.AUTH_NAVER_SECRET,
    }),
    Kakao({
      clientId: PRIVATE_ENV.AUTH_KAKAO_APP_KEY,
      clientSecret: PRIVATE_ENV.AUTH_KAKAO_APP_KEY,
    }),
  ],
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days,
    updateAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    jwt: async ({ token, user, account, trigger, session }) => {
      if (trigger === 'update' && session) {
        const updatedSession = updateSession(session);

        token = Object.assign(token, updatedSession);

        return token;
      }

      const serverCookies = await customCookies.server();

      //* 단순 세션 연장
      if (!user) return token;

      const linkAccountToken = serverCookies.get(COOKIES.LINK_ACCOUNT_TOKEN);

      if (linkAccountToken) {
        const providerAccountId = account?.providerAccountId;

        assert(providerAccountId);

        serverCookies.remove(COOKIES.LINK_ACCOUNT_TOKEN);

        const linkedSession = await linkAccount({
          linkAccountToken,
          newAccount: {
            email: user.email || undefined,
            name: user.name || undefined,
            profileImage: user.image || undefined,
          },
          providerAccountId,
        });

        token = Object.assign(token, linkedSession);

        return token;
      }

      const { provider, providerAccountId: providerId } = account ?? {};

      assertEnum(LOGIN_PROVIDERS, provider);

      assert(providerId);

      const language = serverCookies.get(COOKIES.I18N) || LANGUAGE.ENGLISH;

      const anonymousId = serverCookies.get(COOKIES.ANONYMOUS_ID);

      assert(anonymousId);

      serverCookies.remove(COOKIES.ANONYMOUS_ID);

      const userSession = await getUserSession({
        provider,
        providerId,
        profileImage: user?.image || undefined,
        name: user?.name || undefined,
        email: user?.email || undefined,
        language,
        anonymousId,
      });

      token = Object.assign(token, userSession);

      return token;
    },
    session: async ({ session, token }) => {
      const userSession = omit(token, ['sub', 'iat', 'exp', 'jti']);

      session.user = Object.assign(session.user, userSession);

      return session;
    },
  },
});
