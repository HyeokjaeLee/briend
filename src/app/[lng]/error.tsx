'use client';

import { useEffect } from 'react';
import { RiHome3Fill, RiMessage2Line } from 'react-icons/ri';

import { CustomButton, CustomLink, Lottie } from '@/components';
import { useSidePanel, useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';
import { ERROR_CODE } from '@/utils';

import { useTranslation } from '../i18n/client';

import CommonErrorLottie from './_assets/common-error.json';
import TimeErrorLottie from './_assets/time-error.json';
import UnauthErrorLottie from './_assets/unauth-error.json';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
  isSidePanel?: boolean;
}

export default function ErrorPage({
  error,
  isSidePanel,
  reset,
}: ErrorPageProps) {
  const [errorStatus] = error.message.match(/<[^>]+>/g) ?? [];

  const errorStatusNumber = errorStatus
    ? Number(errorStatus.slice(1, -1))
    : null;

  const { t } = useTranslation('error');

  const { isLogin } = useUserData();

  const dynamicInfo = {
    lottie: CommonErrorLottie as unknown,
    text: t('unknown-error'),
    buttonIcon: <RiHome3Fill />,
    buttonText: t('home-button-text'),
    buttonLink: ROUTES.FRIEND_LIST.pathname,
  };

  switch (errorStatusNumber) {
    case ERROR_CODE.UNAUTHORIZED: {
      dynamicInfo.lottie = UnauthErrorLottie;
      dynamicInfo.text = t('not-allowed');

      break;
    }

    case ERROR_CODE.EXPIRED_CHAT: {
      dynamicInfo.lottie = TimeErrorLottie;
      dynamicInfo.text = t('expired-chat');
      dynamicInfo.buttonIcon = <RiMessage2Line />;

      if (isLogin) {
        dynamicInfo.buttonText = t('create-chat-button-text');
        dynamicInfo.buttonLink = ROUTES.INVITE_CHAT.pathname;
      }
    }
  }

  const setIsErrorRoute = useGlobalStore((state) => state.setIsErrorRoute);

  const sidePanel = useSidePanel();

  useEffect(() => {
    if (isSidePanel) return;

    setIsErrorRoute(true);

    return () => {
      setIsErrorRoute(false);
    };
  }, [setIsErrorRoute, isSidePanel]);

  return (
    <article className="relative size-full flex-1 flex-col gap-8 flex-center">
      <section className="flex-1 flex-col flex-center">
        <Lottie loop animationData={dynamicInfo.lottie} className="w-2/3" />
        <h1 className="whitespace-pre-line text-center text-xl font-semibold">
          {dynamicInfo.text}
        </h1>
      </section>
      <CustomButton
        asChild
        activeScaleDown={false}
        className="mt-auto h-17 w-full rounded-none"
        color="red"
      >
        <CustomLink
          replace
          href={dynamicInfo.buttonLink}
          onClick={(e) => {
            if (isSidePanel) {
              e.preventDefault();

              sidePanel.push(ROUTES.FRIEND_LIST.pathname);
              reset();
            }
          }}
        >
          <div className="mt-1">{dynamicInfo.buttonIcon}</div>
          {isSidePanel ? t('home-button-text') : dynamicInfo.buttonText}
        </CustomLink>
      </CustomButton>
    </article>
  );
}
