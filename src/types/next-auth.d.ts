import type { NextRequest } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type NextAuth from 'next-auth';

import type { LANGUAGE, LOGIN_PROVIDERS } from '@/constants';

export interface UserSession {
  id: string;
  name?: string;
  email?: string;
  profileImage?: string;
  language: LANGUAGE;
  googleId?: string | null;
  kakaoId?: string | null;
  naverId?: string | null;
}

declare module 'next-auth' {
  interface Session {
    user: UserSession;
    firebaseToken: string;
  }
}

export interface RequestWithAuth extends NextRequest {
  auth: null | {
    user: UserSession;
  };
}

export type SessionUpdateType = 'unlink-account' | 'update-profile';

export type SessionUpdateInput =
  | {
      type: 'unlink-account';
      data: {
        provider: LOGIN_PROVIDERS;
      };
    }
  | {
      type: 'update-profile';
      data: Partial<UserSession>;
    };
