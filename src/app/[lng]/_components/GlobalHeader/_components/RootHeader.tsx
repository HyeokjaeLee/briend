'use client';

import { CustomLink, Logo } from '@/components';
import { ROUTES } from '@/routes/client';

export const RootHeader = () => {
  return (
    <nav className="flex h-14 items-center justify-between px-5">
      <CustomLink
        href={ROUTES.FRIEND_LIST.pathname}
        replace
        withAnimation="FROM_LEFT"
      >
        <Logo className="h-7 text-slate-900" />
      </CustomLink>
    </nav>
  );
};
