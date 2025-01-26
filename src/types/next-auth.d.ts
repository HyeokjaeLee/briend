import type { NextRequest } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type NextAuth from 'next-auth';
import { LANGUAGE } from '@/constants';

export interface UserSession {
  id: string;
  name?: string;
  email?: string;
  profileImage?: string;
  language: LANGUAGE;
  googleId?: string;
  kakaoId?: string;
  naverId?: string;
}

declare module 'next-auth' {
  interface Session {
    user: UserSession;
  }
}

export interface RequestWithAuth extends NextRequest {
  auth: null | {
    user: UserSession;
  };
}
