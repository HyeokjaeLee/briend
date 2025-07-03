import { omit } from 'es-toolkit';
import { decodeJwt } from 'jose';
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
import { ROUTES } from './routes/client';
import { assert, assertEnum, customCookies } from './utils';
import { createId } from './utils/createId';
import { ERROR } from './utils/customError';

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
      const serverCookies = await customCookies.server();

      //* 단순 세션 연장
      if (!user) {
        const firebaseToken = token.firebaseToken;

        if (typeof firebaseToken === 'string') {
          console.log(decodeJwt(firebaseToken));
        }

        return token;
      }

      const providerToConnect = serverCookies.get(COOKIES.PROVIDER_TO_CONNECT);

      const userId = serverCookies.get(COOKIES.USER_ID) || createId();

      const { provider, providerAccountId: providerId } = account ?? {};

      assertEnum(LOGIN_PROVIDERS, provider);

      assert(providerId);

      const language = serverCookies.get(COOKIES.I18N) || LANGUAGE.ENGLISH;

      assertEnum(LANGUAGE, language);

      const userSession = await trpc.user.fetchSession({
        provider,
        providerId,
        profileImage: user?.image || undefined,
        userId,
        language,
        name: user?.name || 'Unknown',
      });

      token = Object.assign(token, userSession);

      return token;
    },
    session: async ({ session, token }) => {
      const userSession = omit(token, ['sub', 'iat', 'exp', 'jti']);

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

/**
 * 
 *       if (trigger === 'update' && session) {
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
 * 
 * export const {
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

      const { provider, providerAccountId: providerId } = account ?? {};

      if (!isEnumValue(LOGIN_PROVIDERS, provider))
        throw ERROR.UNKNOWN_VALUE('Provider');

      if (!provider || !providerId)
        throw ERROR.NOT_ENOUGH_PARAMS(['provider', 'providerId']);

      const idKey = `${provider}_id` as const;

      const { email, name } = user ?? {};

      const savedAccount = await prisma.users
        .findFirst({
          where: email ? { email } : { [idKey]: providerId },
        })
        .then(async (existedAccount) => {
          const cookieStore = await cookies();
          const clientId =
            cookieStore.get(COOKIES.USER_ID)?.value || createId();

          //* 🔗 계정연동을 위한 인증 시도 시 true
          const providerToConnect = cookieStore.get(
            COOKIES.PROVIDER_TO_CONNECT,
          )?.value;

          const connectingBaseAccount = providerToConnect
            ? await prisma.users.findUnique({
                where: {
                  id: clientId,
                },
              })
            : null;

          if (existedAccount) {
            if (connectingBaseAccount) {
              //* 🗑️ 로그인 되어있던 계정과 연동하려는 계정이 다른 경우 연동하려는 계정을 삭제 후 연동
              if (existedAccount.id !== clientId) {
                await prisma.users.delete({
                  where: {
                    id: existedAccount.id,
                  },
                });
              }

              const updatedUserData = await prisma.users.update({
                where: {
                  id: connectingBaseAccount.id,
                },
                data: dataToUpdateKeys.reduce((acc, key) => {
                  if (!connectingBaseAccount[key]) {
                    //* 🔗 연동하기 위한 계정은 있지만 해당 계정에 연동할 계정의 소셜로그인 아이디가 없거나 같지 않은 경우 연동
                    acc[key] =
                      key === idKey && acc[key] !== providerId
                        ? providerId
                        : existedAccount[key] || undefined;
                  }

                  return acc;
                }, {} as DataToUpdate),
              });

              return updatedUserData;
            }

            const updatedUserData = await prisma.users.update({
              where: {
                id: existedAccount.id,
              },
              data: {
                //! 연동하려는 계정에 이미 연동된 계정이 있는 경우 연동 안함
                [idKey]:
                  existedAccount[idKey] === providerId ? undefined : providerId,
                email: existedAccount.email || email || undefined,
                name: existedAccount.name || name || undefined,
              },
            });

            return updatedUserData;
          }

          const newUserData = {
            id: clientId,
            email,
            name,
            [idKey]: providerId,
          };

          try {
            const user = connectingBaseAccount
              ? await prisma.users.update({
                  where: {
                    id: connectingBaseAccount.id,
                  },
                  data: {
                    email: email || undefined,
                    name: name || undefined,
                    [idKey]: providerId,
                  },
                })
              : await prisma.users.create({
                  data: newUserData,
                });

            return user;
          } catch {
            //! 중복된 id를 가진 경우 새로운 id를 생성하여 유저 생성
            const createUserWithNewId = async () => {
              newUserData.id = createId();

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
        ...pick(savedAccount, ['id', 'name', 'email']),
        isKakaoConnected: !!savedAccount.kakao_id,
        isGoogleConnected: !!savedAccount.google_id,
        isNaverConnected: !!savedAccount.naver_id,
      };

      return token;
 */
