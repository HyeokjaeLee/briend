'use client';

import { useEffect } from 'react';
import { BiMessageSquare, BiMessageSquareAdd, BiMenu } from 'react-icons/bi';
import type { IconType } from 'react-icons/lib';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { CustomLink } from '@/components/CustomLink';
import { ROUTES } from '@/routes/client';
import { useHistoryStore } from '@/stores/history';
import { findRoute, isArrayItem } from '@/utils';
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
    routeName: 'CHATTING',
    translationKey: 'chat',
  },
  {
    icon: BiMessageSquareAdd,
    routeName: 'INVITE_CHAT',
    translationKey: 'invite-chat',
  },
  {
    icon: BiMenu,
    routeName: 'MORE_MENUS',
    translationKey: 'more',
  },
];

const SESSION_KEY = 'root-nav-animation';

export const RootNav = ({ pathname }: RootNavProps) => {
  const currentRoute = findRoute(pathname);
  const currentRouteIndex = NAVIGATION_ITEMS.findIndex(
    ({ routeName }) => ROUTES[routeName] === currentRoute,
  );

  const setRootAnimation = useHistoryStore(
    ({ setRootAnimation }) => setRootAnimation,
  );

  const { t } = useTranslation('layout');

  useEffect(() => {
    //! 애니메이션 정보를 저장 후 다음 라우트에서 사용
    const animation = sessionStorage.getItem(SESSION_KEY);

    if (isArrayItem(['left', 'right'] as const, animation)) {
      setRootAnimation(animation);

      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [pathname, setRootAnimation]);

  return (
    <nav className="flex justify-center border-t-2 border-t-zinc-100 bg-white px-6 py-3">
      <ul className="flex w-full max-w-96 justify-between gap-10">
        {NAVIGATION_ITEMS.map(
          ({ icon: Icon, routeName, translationKey }, index) => {
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
                  onClick={() => {
                    if (index < currentRouteIndex) {
                      sessionStorage.setItem(SESSION_KEY, 'right');
                    } else if (index > currentRouteIndex) {
                      sessionStorage.setItem(SESSION_KEY, 'left');
                    }
                  }}
                >
                  <CustomLink replace href={route.pathname}>
                    {contents}
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
