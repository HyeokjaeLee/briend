import type { UserSession } from './types/next-auth';
import type { JWT } from 'next-auth/jwt';

import { pick } from 'es-toolkit';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';

import { trpc } from './app/trpc/server';
import { LANGUAGE } from './constants';
import { COOKIES } from './constants/cookies';
import { LOGIN_PROVIDERS } from './constants/etc';
import { PRIVATE_ENV } from './constants/private-env';
import { prisma } from './prisma';
import { ROUTES } from './routes/client';
import { assert, assertEnum } from './utils';
import { createId } from './utils/createId';
import { CustomError, ERROR } from './utils/customError';
import { isEnumValue } from './utils/isEnumValue';

export interface SessionDataToUpdate {
  unlinkedProvider?: LOGIN_PROVIDERS;
  updatedProfile?: {
    nickname: string;
  };
}

const dataToUpdateKeys = [
  'email',
  'name',
  'google_id',
  'kakao_id',
  'naver_id',
] as const;

type DataToUpdateKeys = (typeof dataToUpdateKeys)[number];
type DataToUpdate = Record<DataToUpdateKeys, string | null | undefined>;

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
    maxAge: 604_800, // 7 days
  },
  callbacks: {
    jwt: async ({ token, user, account, trigger, session }) => {
      if (trigger === 'update' && session) {
        const sessionDataToUpdate: SessionDataToUpdate = session;

        switch (sessionDataToUpdate.unlinkedProvider) {
          case LOGIN_PROVIDERS.GOOGLE:
            token.isGoogleConnected = false;
            break;
          case LOGIN_PROVIDERS.KAKAO:
            token.isKakaoConnected = false;
            break;
          case LOGIN_PROVIDERS.NAVER:
            token.isNaverConnected = false;
            break;
          default:
            break;
        }

        if (sessionDataToUpdate.updatedProfile) {
          token.name = sessionDataToUpdate.updatedProfile.nickname;
        }

        return token;
      }

      if (!user) return token;

      const cookieStore = await cookies();

      const clientId = cookieStore.get(COOKIES.USER_ID)?.value || createId();

      const { provider, providerAccountId: providerId } = account ?? {};

      assertEnum(LOGIN_PROVIDERS, provider);

      assert(providerId);

      const language = cookieStore.get(COOKIES.I18N)?.value || LANGUAGE.ENGLISH;

      assertEnum(LANGUAGE, language);

      const userSession = await trpc.user.fetchSession({
        provider,
        providerId,
        profileImage: user?.image || undefined,
        userId: clientId,
        language,
        name: user?.name || 'Unknown',
      });

      token = Object.assign(token, userSession);

      return token;
    },
    session: async ({ session, token }) => {
      const userSession = pick(token as JWT & UserSession, [
        'id',
        'name',
        'profileImage',
        'language',
        'email',
        'naverId',
        'googleId',
        'kakaoId',
      ]);

      session.user = Object.assign(session.user, userSession);

      return session;
    },
    //* 🔒 Access slug redirect 🔒
    authorized: async ({ request, auth }) => {
      const { nextUrl } = request;
      const accessSlug: string | undefined = nextUrl.pathname.split('/')[2];

      const isPrivateRoute = accessSlug === 'private';

      if (isPrivateRoute) {
        try {
          if (!auth?.expires) throw ERROR.UNAUTHORIZED();
        } catch {
          const res = NextResponse.redirect(
            new URL(ROUTES.LOGIN.pathname, nextUrl.origin),
          );

          res.cookies.set(COOKIES.PRIVATE_REFERER, nextUrl.href);

          return res;
        }
      }

      const isGuestRoute = accessSlug === 'guest';

      if (isGuestRoute && auth) {
        const privateReferer = request.cookies.get(COOKIES.PRIVATE_REFERER);

        if (privateReferer) {
          const res = NextResponse.redirect(privateReferer.value);

          res.cookies.delete(COOKIES.PRIVATE_REFERER);

          return res;
        }

        return NextResponse.redirect(
          new URL(ROUTES.FRIEND_LIST.pathname, nextUrl.origin),
        );
      }
    },
  },
});
