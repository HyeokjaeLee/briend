import { pick } from 'es-toolkit';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';
import { random as randomEmoji } from 'node-emoji';

import { LOGIN_PROVIDERS } from './constants/\betc';
import { COOKIES } from './constants/cookies-key';
import { SECRET_ENV } from './constants/secret-env';
import { prisma } from './prisma';
import { ROUTES } from './routes/client';
import { CustomError } from './utils/customError';
import { isEnumValue } from './utils/isEnumValue';

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
      clientId: SECRET_ENV.AUTH_NAVER_CLIENT_ID,
      clientSecret: SECRET_ENV.AUTH_NAVER_SECRET,
    }),
    Kakao({
      clientId: SECRET_ENV.AUTH_KAKAO_APP_KEY,
      clientSecret: SECRET_ENV.AUTH_KAKAO_APP_KEY,
    }),
  ],
  session: {
    maxAge: 604_800, // 7 days
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (!user) return token;

      const { provider, providerAccountId: providerId } = account ?? {};

      if (!isEnumValue(LOGIN_PROVIDERS, provider))
        throw new CustomError({
          message: 'Unknown Provider',
        });

      if (!provider || !providerId) throw new CustomError();

      const idKey = `${provider}_id` as const;

      const { email, name } = user ?? {};

      const savedAccount = await prisma.users
        .findFirst({
          where: email ? { email } : { [idKey]: providerId },
        })
        .then(async (existedAccount) => {
          if (existedAccount) {
            return prisma.users.update({
              where: { id: existedAccount.id },
              data: {
                [idKey]: existedAccount[idKey] ? undefined : providerId,
                email: email || undefined,
                name: name || undefined,
              },
            });
          }

          const newUserData = {
            emoji: randomEmoji().emoji,
            id: cookies().get(COOKIES.USER_ID)?.value || nanoid(),
            email,
            name,
            [idKey]: providerId,
          };

          try {
            const user = await prisma.users.create({
              data: newUserData,
            });

            return user;
          } catch (e) {
            //! 중복된 id를 가진 경우 새로운 id를 생성하여 유저 생성
            const createUserWithNewId = async () => {
              newUserData.id = nanoid();

              try {
                const user = await prisma.users.create({
                  data: newUserData,
                });

                return user;
              } catch (e) {
                if (
                  !(e instanceof Error) ||
                  !e.message.includes('Unique constraint')
                )
                  throw e;

                return createUserWithNewId();
              }
            };

            return createUserWithNewId();
          }
        });

      token = {
        ...pick(savedAccount, ['id', 'name', 'email', 'emoji']),
        isKakaoConnected: !!savedAccount.kakao_id,
        isGoogleConnected: !!savedAccount.google_id,
        isNaverConnected: !!savedAccount.naver_id,
        isAppleConnected: !!savedAccount.apple_id,
      };

      return token;
    },
    session: async ({ session, token }) => {
      (['id', 'name', 'email', 'emoji'] as const).forEach((key) => {
        const value = token[key];

        if (typeof value === 'string') {
          switch (key) {
            case 'emoji':
              //! 간혹 이모지에 공백이 들어가는 경우가 있음
              session.user.emoji = value.trim();
              break;
            default:
              session.user[key] = value;
          }
        }
      });

      (
        [
          'isKakaoConnected',
          'isGoogleConnected',
          'isNaverConnected',
          'isAppleConnected',
        ] as const
      ).forEach((key) => {
        const value = token[key];

        if (typeof value === 'boolean') {
          session.user[key] = value;
        }
      });

      return session;
    },
    //* 🔒 Access slug redirect 🔒
    authorized: async ({ request, auth }) => {
      const { nextUrl } = request;
      const accessSlug: string | undefined = nextUrl.pathname.split('/')[2];

      const isPrivateRoute = accessSlug === 'private';

      if (isPrivateRoute) {
        try {
          if (!auth?.expires)
            throw new CustomError({ message: 'Unauthorized' });
        } catch {
          const res = NextResponse.redirect(
            new URL(ROUTES.LOGIN.pathname, nextUrl.origin),
          );
          res.cookies.delete(COOKIES.ACCESS_TOKEN);
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
          new URL(ROUTES.CHATTING_LIST.pathname, nextUrl.origin),
        );
      }
    },
  },
});
