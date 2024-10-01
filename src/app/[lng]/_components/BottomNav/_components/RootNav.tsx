'use client';

import { useEffect } from 'react';
import { BiMessageSquare, BiMessageSquareAdd, BiMenu } from 'react-icons/bi';
import type { IconType } from 'react-icons/lib';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { CustomLink } from '@/components/CustomLink';
import { SESSION } from '@/constants/storage-key';
import { ROUTES } from '@/routes/client';
import { useHistoryStore } from '@/stores/history';
import { findRoute } from '@/utils/findRoute';
import { isArrayItem } from '@/utils/isArrayItem';

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
    routeName: 'CHATTING_LIST',
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
    const animation = sessionStorage.getItem(SESSION.ROOT_NAV_ANIMATION);

    if (isArrayItem(['left', 'right'] as const, animation)) {
      setRootAnimation(animation);

      sessionStorage.removeItem(SESSION.ROOT_NAV_ANIMATION);
    }
  }, [pathname, setRootAnimation]);

  return (
    <nav className="flex justify-center border-t-2 border-t-zinc-100 bg-white px-6 py-3">
      <ul className="flex w-full max-w-96 justify-between gap-10">
        {NAVIGATION_ITEMS.map(
          ({ icon: Icon, routeName, translationKey }, index) => {
            const route = ROUTES[routeName];

            const isActive = currentRoute === route;

            const contents = (
              <>
                <Icon className="size-6" />
                {t(translationKey)}
              </>
            );

            return typeof route.pathname === 'string' ? (
              <li key={route.index}>
                <CustomButton
                  asChild
                  className="flex flex-col items-center justify-center gap-1 text-xs"
                  color={isActive ? 'blue' : 'gray'}
                  variant="ghost"
                  onClick={() => {
                    if (index < currentRouteIndex) {
                      sessionStorage.setItem(
                        SESSION.ROOT_NAV_ANIMATION,
                        'right',
                      );
                    } else if (index > currentRouteIndex) {
                      sessionStorage.setItem(
                        SESSION.ROOT_NAV_ANIMATION,
                        'left',
                      );
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
