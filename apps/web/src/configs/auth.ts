import { omit } from 'es-toolkit';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';

import { LANGUAGE } from '@/constants';
import { COOKIES } from '@/constants/cookies';
import { LOGIN_PROVIDERS } from '@/constants/etc';
import { PRIVATE_ENV } from '@/constants/private-env';
import { createClient } from '@/database/supabase/server';
import { API_ROUTES } from '@/routes/api';
import type * as JwtPayload from '@/types/jwt';
import { assert, assertEnum, customCookies } from '@/utils';
import { jwtAuthSecret } from '@/utils/server';

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
    Google({
      clientId: PRIVATE_ENV.AUTH_GOOGLE_ID,
      clientSecret: PRIVATE_ENV.AUTH_GOOGLE_SECRET,
    }),
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
        const updatedSession = (() => {
          const { type, data } = session;

          switch (type) {
            case 'unlink-account':
              return {
                [`${data.provider}Id`]: null,
              };

            case 'update-profile':
              return data;
          }
        })();

        token = Object.assign(token, updatedSession);

        return token;
      }

      const serverCookies = await customCookies.server();

      //* 단순 세션 연장
      if (!user) return token;

      // Supabase 연동 - 사용자 정보 동기화
      try {
        const supabase = await createClient();
        
        // Supabase에 사용자 정보 저장/업데이트
        const userData = {
          id: user.id || token.sub || '',
          email: user.email || '',
          username: user.name || 'Anonymous',
          avatar: user.image || null,
        };

        const { error: dbError } = await supabase
          .from('users')
          .upsert(userData, { onConflict: 'id' });

        if (dbError) {
          console.error('Supabase user sync error:', dbError);
        }

        // provider_accounts 테이블에 OAuth 정보 저장
        if (account) {
          const { error: providerError } = await supabase
            .from('provider_accounts')
            .upsert({
              user_id: userData.id,
              provider: account.provider,
              provider_account_id: account.providerAccountId || '',
            }, { onConflict: 'provider,provider_account_id' });

          if (providerError) {
            console.error('Supabase provider sync error:', providerError);
          }
        }
      } catch (error) {
        console.error('Supabase sync error:', error);
      }

      const linkBaseAccountToken = serverCookies.get(
        COOKIES.LINK_BASE_ACCOUNT_TOKEN,
      );

      //* 계정 연동
      if (linkBaseAccountToken) {
        const providerAccountId = account?.providerAccountId;

        assert(providerAccountId);

        serverCookies.remove(COOKIES.LINK_BASE_ACCOUNT_TOKEN);

        const linkNewAccountToken = await jwtAuthSecret.sign({
          providerAccountId,
          email: user.email || undefined,
          name: user.name || undefined,
          profileImage: user.image || undefined,
        } satisfies JwtPayload.LinkNewAccountToken);

        const linkedSession = await API_ROUTES.POST_ACCOUNT({
          linkBaseAccountToken,
          linkNewAccountToken,
        }).json();

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

      const syncUserToken = await jwtAuthSecret.sign({
        provider,
        providerId,
        profileImage: user?.image || undefined,
        name: user?.name || undefined,
        email: user?.email || undefined,
        language,
        anonymousId,
      } satisfies JwtPayload.SyncUserToken);

      const userSession = await API_ROUTES.POST_USER_DATA({
        syncUserToken,
      }).json();

      token = Object.assign(token, userSession);

      serverCookies.set(COOKIES.CHANGED_SESSION, 'login');

      return token;
    },
    session: async ({ session, token }) => {
      const userSession = omit(token, ['sub', 'iat', 'exp', 'jti']);

      session.user = Object.assign(session.user, userSession);

      return session;
    },
  },
});
