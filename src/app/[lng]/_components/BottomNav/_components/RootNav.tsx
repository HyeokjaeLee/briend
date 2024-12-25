'use client';

import { useState } from 'react';
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
import { CustomLink } from '@/components';
import { useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { cn, findRoute } from '@/utils';

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
    routeName: 'FRIEND_LIST',
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
    ({ routeName }) => routeName === currentRoute.name,
  );

  const [activeIndex, setActiveIndex] = useState(currentRouteIndex);

  const { isLogin } = useUserData();

  const { t } = useTranslation('layout');

  return (
    <nav className="flex justify-center border-t border-t-slate-100">
      <ul className="flex w-full justify-between">
        {NAVIGATION_ITEMS.map(
          ({ icon, fillIcon, routeName, translationKey }, index) => {
            const route = ROUTES[routeName];

            const isActive = activeIndex === index;

            const Icon = isActive ? fillIcon : icon;

            return typeof route.pathname === 'string' ? (
              <li key={route.index} className="flex-1">
                <CustomLink
                  className={cn(
                    'py-3 flex-center flex-col gap-1 text-xs rounded-md group',
                    'active:scale-90 transition-all duration-75 ease-out',
                    isActive ? 'font-bold text-sky-500' : 'text-slate-400',
                  )}
                  href={route.pathname}
                  //! 로그인 하지 않았을때 로그인 창으로 미들웨어가 리다이렉팅함, 뒤로 가기 시 앱 밖으로 나가는것을 방지
                  replace={isLogin}
                  withAnimation={
                    isLogin
                      ? index < currentRouteIndex
                        ? 'FROM_LEFT'
                        : 'FROM_RIGHT'
                      : 'FROM_BOTTOM'
                  }
                  onClick={() => setActiveIndex(index)}
                >
                  <Icon
                    className={cn('size-6 animate-duration-300', {
                      'animate-jump': isActive,
                    })}
                  />
                  {t(translationKey)}
                </CustomLink>
              </li>
            ) : null;
          },
        )}
      </ul>
    </nav>
  );
};
