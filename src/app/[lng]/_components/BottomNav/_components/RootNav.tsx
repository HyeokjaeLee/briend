'use client';

import { useSession } from 'next-auth/react';

import type { IconType } from 'react-icons/lib';
import {
  RiAddCircleLine,
  RiAddCircleFill,
  RiAccountCircleLine,
  RiAccountCircleFill,
  RiMessage3Line,
  RiMessage3Fill,
} from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/atoms/CustomButton';
import { CustomLink } from '@/components/atoms/CustomLink';
import { ROUTES } from '@/routes/client';
import { cn } from '@/utils/cn';
import { findRoute } from '@/utils/findRoute';

interface RootNavProps {
  pathname: string;
}

interface NavigationItem {
  icon: IconType;
  fillIcon: IconType;
  routeName: keyof typeof ROUTES;
  translationKey: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    icon: RiMessage3Line,
    fillIcon: RiMessage3Fill,
    routeName: 'HOME',
    translationKey: 'chat',
  },
  {
    icon: RiAddCircleLine,
    fillIcon: RiAddCircleFill,
    routeName: 'INVITE_CHAT',
    translationKey: 'invite-chat',
  },
  {
    icon: RiAccountCircleLine,
    fillIcon: RiAccountCircleFill,
    routeName: 'MORE_MENUS',
    translationKey: 'more',
  },
];

export const RootNav = ({ pathname }: RootNavProps) => {
  const currentRoute = findRoute(pathname);

  const currentRouteIndex = NAVIGATION_ITEMS.findIndex(
    ({ routeName }) => ROUTES[routeName] === currentRoute,
  );

  const session = useSession();

  const isAuthenticated = session.status === 'authenticated';

  const { t } = useTranslation('layout');

  return (
    <nav className="flex justify-center border-t border-t-slate-100 px-16 py-3">
      <ul className="flex w-full max-w-96 justify-between gap-10">
        {NAVIGATION_ITEMS.map(
          ({ icon, fillIcon, routeName, translationKey }, index) => {
            const route = ROUTES[routeName];

            const isActive = currentRoute === route;

            const Icon = isActive ? fillIcon : icon;

            return typeof route.pathname === 'string' ? (
              <li key={route.index}>
                <CustomButton
                  asChild
                  className="flex flex-col items-center justify-center gap-1 text-xs"
                  color="gray"
                  size="3"
                  variant="ghost"
                >
                  <CustomLink
                    className={
                      isActive ? 'font-bold text-sky-500' : 'text-slate-400'
                    }
                    href={route.pathname}
                    //! 로그인 하지 않았을때 로그인 창으로 미들웨어가 리다이렉팅함, 뒤로 가기 시 앱 밖으로 나가는것을 방지
                    replace={isAuthenticated}
                    withAnimation={
                      isAuthenticated
                        ? index < currentRouteIndex
                          ? 'FROM_LEFT'
                          : 'FROM_RIGHT'
                        : 'FROM_BOTTOM'
                    }
                  >
                    <Icon
                      className={cn('size-6', {
                        'animate-jump animate-duration-300': isActive,
                      })}
                    />
                    {t(translationKey)}
                  </CustomLink>
                </CustomButton>
              </li>
            ) : null;
          },
        )}
      </ul>
    </nav>
  );
};
