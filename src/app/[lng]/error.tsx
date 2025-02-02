'use client';

import { useShallow } from 'zustand/shallow';

import { memo, useEffect } from 'react';
import { RiHome3Fill, RiMessage2Line } from 'react-icons/ri';

import { CustomButton, DotLottie } from '@/components';
import { useSidePanel, useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore, useSidePanelStore } from '@/stores';
import { ERROR_CODE } from '@/utils';

import { useTranslation } from '../i18n/client';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
  isSidePanel?: boolean;
}

const ErrorPage = ({ error, reset, isSidePanel }: ErrorPageProps) => {
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
    if (isSidePanel) return setIsErrorSideRoute(true);

    setIsErrorRoute(true);

    return () => {
      setIsErrorRoute(false);
    };
  }, [isSidePanel, setIsErrorRoute, setIsErrorSideRoute]);

  return (
    <article className="relative size-full flex-1 flex-col gap-8 flex-center">
      <section className="flex-1 flex-col flex-center">
        <DotLottie loop className="h-1/2 w-full" src={dynamicInfo.lottie} />
        <strong className="mb-2 text-center text-xl font-semibold">
          {errorStatus}
        </strong>
        <p className="whitespace-pre-line text-center text-zinc-600">
          {dynamicInfo.text}
        </p>
      </section>
      {isSidePanel ? null : (
        <CustomButton
          activeScaleDown={false}
          className="mt-auto h-17 w-full rounded-none"
          onClick={() => {
            if (isSidePanel) return sidePanel.push(ROUTES.FRIEND_LIST.pathname);

            location.replace(dynamicInfo.buttonLink);
          }}
        >
          <div className="mt-1">{dynamicInfo.buttonIcon}</div>
          {dynamicInfo.buttonText}
        </CustomButton>
      )}
    </article>
  );
};

export default memo(ErrorPage);
