import type { Firestore } from './database/firestore/type';
import type { UserSession } from './types/next-auth';

import { omit } from 'es-toolkit';
import { decodeJwt } from 'jose';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';

import { LANGUAGE } from './constants';
import { COOKIES } from './constants/cookies';
import { LOGIN_PROVIDERS } from './constants/etc';
import { IS_NODEJS, PRIVATE_ENV } from './constants/private-env';
import { firestore } from './database/firestore/server';
import { assert, assertEnum, customCookies } from './utils';
import { createId } from './utils/createId';
import { getFirebaseAdminAuth } from './utils/server';

interface GetUserSessionProps {
  provider: LOGIN_PROVIDERS;
  providerId: string;
  userId: string;
  name: string;
  email?: string;
  profileImage?: string;
  language: LANGUAGE;
}

const getUserSession = async (props: GetUserSessionProps) => {
  const providerAccountId = `${props.provider}-${props.providerId}`;

  const providerAccountDoc = await firestore((db) =>
    db.collection('providerAccounts').doc(providerAccountId).get(),
  );

  const idKey = `${props.provider}Id` as const;

  let id = props.userId;

  const userSession: UserSession = {
    id,
    name: props.name,
    profileImage: props.profileImage,
    language: props.language,
    email: props.email,
    [idKey]: props.providerId,
  };

  const auth = await getFirebaseAdminAuth();

  if (providerAccountDoc.exists) {
    const { userId } = providerAccountDoc.data() as Firestore.ProviderAccount;

    const userDoc = await firestore((db) =>
      db.collection('users').doc(userId).get(),
    );

    const savedUserInfo = userDoc.data() as Firestore.UserInfo;

    return {
      ...userSession,
      ...savedUserInfo,
      firebaseToken: await auth.createCustomToken(id),
    };
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    //* 존재 하지 않는 id를 생성할 때 까지 반복
    try {
      await auth.getUser(id);

      id = createId();
    } catch {
      break;
    }
  }

  userSession.id = id;

  await Promise.all([
    auth.createUser({
      displayName: props.name,
      email: props.email,
      photoURL: props.profileImage,
      uid: id,
    }),
    firestore((db) =>
      db
        .collection('providerAccounts')
        .doc(providerAccountId)
        .set({ userId: id }),
    ),
    firestore((db) =>
      db
        .collection('users')
        .doc(id)
        .set({
          language: props.language,
          [idKey]: props.providerId,
        } satisfies Firestore.UserInfo),
    ),
  ]);

  return {
    ...userSession,
    firebaseToken: await auth.createCustomToken(id),
  };
};
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

      if (
        IS_NODEJS &&
        typeof token.id === 'string' &&
        !serverCookies.get(COOKIES.FIREBASE_TOKEN)
      ) {
        const auth = await getFirebaseAdminAuth();

        const firebaseToken = await auth.createCustomToken(token.id);

        const { exp = 0 } = decodeJwt(firebaseToken);

        const expires = new Date(Date.now() + exp * 1000);

        serverCookies.set(COOKIES.FIREBASE_TOKEN, firebaseToken, {
          httpOnly: true,
          secure: true,
          expires,
        });
      }

      //* 단순 세션 연장
      if (!user) return token;

      const providerToConnect = serverCookies.get(COOKIES.PROVIDER_TO_CONNECT);

      const userId = serverCookies.get(COOKIES.USER_ID) || createId();

      const { provider, providerAccountId: providerId } = account ?? {};

      assertEnum(LOGIN_PROVIDERS, provider);

      assert(providerId);

      const language = serverCookies.get(COOKIES.I18N) || LANGUAGE.ENGLISH;

      assertEnum(LANGUAGE, language);

      if (IS_NODEJS) {
        const userSession = await getUserSession({
          provider,
          providerId,
          profileImage: user?.image || undefined,
          userId,
          language,
          name: user?.name || 'Unknown',
        });

        token = Object.assign(token, userSession);
      }

      return token;
    },
    session: async ({ session, token }) => {
      const userSession = omit(token, ['sub', 'iat', 'exp', 'jti']);

      session.user = Object.assign(session.user, userSession);

      return session;
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
