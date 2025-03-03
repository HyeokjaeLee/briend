'use client';

import { useLayoutEffect, useState } from 'react';
import type { IconType } from 'react-icons/lib';
import {
  RiAccountCircleFill,
  RiAccountCircleLine,
  RiAddCircleFill,
  RiAddCircleLine,
  RiMessage3Fill,
  RiMessage3Line,
} from 'react-icons/ri';

import { CustomLink } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { IS_TOUCH_DEVICE } from '@/constants';
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

  useLayoutEffect(() => {
    setActiveIndex(currentRouteIndex);
  }, [currentRouteIndex]);

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
                    'flex-center group flex-col gap-1 py-3 text-xs',
                    {
                      'hover:text-primary/50 hover:bg-primary/5':
                        !IS_TOUCH_DEVICE && !isActive,
                    },
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-primary/30 active:text-primary active:font-bold',
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
                  onClick={(e) => {
                    if (activeIndex === index) return e.preventDefault();

                    setActiveIndex(index);
                  }}
                >
                  <Icon
                    className={cn(
                      'animate-duration-300 size-6',
                      isActive ? 'animate-jump' : 'group-active:animate-jump',
                    )}
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
