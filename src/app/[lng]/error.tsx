'use client';

import { useEffect } from 'react';
import { RiHome3Fill, RiMessage2Line } from 'react-icons/ri';
import { useShallow } from 'zustand/shallow';

import { Button, DotLottie } from '@/components';
import { SESSION_STORAGE } from '@/constants';
import { useSidePanel, useThisSidePanel, useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore, useSidePanelStore } from '@/stores';
import { ERROR_CODE } from '@/utils';

import { useTranslation } from '../../configs/i18n/client';

interface ErrorPageProps {
  error: Error;
  reset?: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [errorStatus] = error.message.match(/<[^>]+>/g) ?? [];
  const [setIsErrorSideRoute, setResetError] = useSidePanelStore(
    useShallow((state) => [state.setIsErrorRoute, state.setResetError]),
  );
  const setIsErrorRoute = useGlobalStore((state) => state.setIsErrorRoute);

  const errorStatusNumber = errorStatus
    ? Number(errorStatus.slice(1, -1))
    : null;

  const { t } = useTranslation('error');

  const { isLogin } = useUserData();

  const { isSidePanel } = useThisSidePanel();

  const dynamicInfo = {
    lottie: '/assets/lottie/404.lottie',
    text: t('unknown-error'),
    buttonIcon: <RiHome3Fill />,
    buttonText: t('home-button-text'),
    buttonLink: ROUTES.FRIEND_LIST.pathname,
  };

  switch (errorStatusNumber) {
    case ERROR_CODE.UNAUTHORIZED: {
      dynamicInfo.lottie = '/assets/lottie/401.lottie';
      dynamicInfo.text = t('not-allowed');

      break;
    }

    case ERROR_CODE.EXPIRED_CHAT: {
      dynamicInfo.lottie = '/assets/lottie/expired.lottie';
      dynamicInfo.text = t('expired-chat');
      dynamicInfo.buttonIcon = <RiMessage2Line />;

      if (isLogin) {
        dynamicInfo.buttonText = t('create-chat-button-text');
        dynamicInfo.buttonLink = ROUTES.INVITE_CHAT.pathname;
      }
    }
  }

  const sidePanel = useSidePanel();

  if (isSidePanel) setResetError(reset);

  useEffect(() => {
    if (isSidePanel) {
      sessionStorage.removeItem(SESSION_STORAGE.SIDE_PANEL_URL);

      return setIsErrorSideRoute(true);
    }

    setIsErrorRoute(true);

    return () => {
      setIsErrorRoute(false);
    };
  }, [isSidePanel, setIsErrorRoute, setIsErrorSideRoute]);

  return (
    <article className="flex-center relative size-full flex-1 flex-col gap-8">
      <section className="flex-center flex-1 flex-col">
        <DotLottie
          loop
          className="aspect-square w-4/5"
          src={dynamicInfo.lottie}
        />
        <strong className="mb-2 text-center text-xl font-semibold">
          {errorStatus}
        </strong>
        <p className="whitespace-pre-line text-center text-zinc-600">
          {dynamicInfo.text}
        </p>
      </section>
      {isSidePanel ? null : (
        <Button
          activeScaleDown={false}
          className="h-17 mt-auto w-full rounded-none"
          onClick={() => {
            if (isSidePanel) return sidePanel.push(ROUTES.FRIEND_LIST.pathname);

            location.replace(dynamicInfo.buttonLink);
          }}
        >
          <div className="mt-1">{dynamicInfo.buttonIcon}</div>
          {dynamicInfo.buttonText}
        </Button>
      )}
    </article>
  );
}
