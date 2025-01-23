import NextAuth from 'next-auth';
import type { AuthConfig } from '@auth/core';
import { handlers } from '@/auth';

export const { GET, POST } = handlers;

export const runtime = 'nodejs';
