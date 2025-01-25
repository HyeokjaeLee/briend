import type { NextRequest } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type NextAuth from 'next-auth';

export interface UserSession {
  id: string;
  name?: string;
  email?: string;
  isKakaoConnected: boolean;
  isGoogleConnected: boolean;
  isAppleConnected: boolean;
  isNaverConnected: boolean;
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
