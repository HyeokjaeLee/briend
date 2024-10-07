import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { random as randomEmoji } from 'node-emoji';

import { COOKIES } from './constants/cookies-key';
import { prisma } from './prisma';
import { ROUTES } from './routes/client';
import { CustomError } from './utils/customError';

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  providers: [Google],
  session: {
    maxAge: 604_800, // 7 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (!user) return token;

      const { email, name } = user;

      if (!email)
        throw new CustomError({
          message: 'email is required',
        });

      const existingUser = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        token.id = existingUser.id;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.emoji = existingUser.emoji;
      } else {
        const id = cookies().get(COOKIES.USER_ID)?.value || nanoid();
        const emoji = randomEmoji().emoji;

        token.id = id;
        token.name = name;
        token.email = email;
        token.emoji = emoji;

        await prisma.users.create({
          data: {
            id,
            email,
            name,
            emoji,
          },
        });
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (['id', 'name', 'email', 'emoji'] as const).forEach((key) => {
          const value = token[key];

          if (typeof value !== 'string')
            throw new CustomError({
              message: `${key} is not string`,
            });

          switch (key) {
            case 'emoji':
              //! 간혹 이모지에 공백이 들어가는 경우가 있음
              session.user.emoji = value.trim();
              break;
            default:
              session.user[key] = value;
          }
        });
      }

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
