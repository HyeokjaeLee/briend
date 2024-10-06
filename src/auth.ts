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

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    maxAge: 604_800,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (!user) return token;

      const email = user.email;

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
      } else {
        await prisma.users.create({
          data: {
            id: cookies().get(COOKIES.USER_ID)?.value || nanoid(),
            email,
            name: user.name,
            emoji: randomEmoji().emoji,
          },
        });
      }

      return token;
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
