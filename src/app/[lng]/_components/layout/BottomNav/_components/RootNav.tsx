'use client';

import { BiMessageSquare, BiMessageSquareAdd, BiMenu } from 'react-icons/bi';
import type { IconType } from 'react-icons/lib';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { CustomLink } from '@/components/CustomLink';
import { ROUTES } from '@/routes/client';
import { findCurrentRoute } from '@/utils';
interface RootNavProps {
  pathname: string;
}

interface NavigationItem {
  icon: IconType;
  routeName: keyof typeof ROUTES;
  translationKey: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    icon: BiMessageSquare,
    routeName: 'MESSAGE',
    translationKey: 'message',
  },
  {
    icon: BiMessageSquareAdd,
    routeName: 'INVITE_CHAT',
    translationKey: 'inviteChat',
  },
  {
    icon: BiMenu,
    routeName: 'MORE_MENUS',
    translationKey: 'more',
  },
];

export const RootNav = ({ pathname }: RootNavProps) => {
  const currentRoute = findCurrentRoute(pathname);

  const { t } = useTranslation('layout');

  return (
    <nav className="flex justify-center border-t-2 border-t-zinc-100 bg-white px-6 py-3">
      <ul className="flex w-full max-w-96 justify-between gap-10">
        {NAVIGATION_ITEMS.map(({ icon: Icon, routeName, translationKey }) => {
          const route = ROUTES[routeName];

          const isActive = currentRoute?.id === route.id;

          const contents = (
            <>
              <Icon className="size-6" />
              {t(translationKey)}
            </>
          );

          return typeof route.pathname === 'string' ? (
            <li key={route.id}>
              <CustomButton
                asChild
                className="flex flex-col items-center justify-center gap-1 text-xs"
                color={isActive ? 'blue' : 'gray'}
                variant="ghost"
              >
                <CustomLink replace href={route.pathname}>
                  {contents}
                </CustomLink>
              </CustomButton>
            </li>
          ) : null;
        })}
      </ul>
    </nav>
  );
};
