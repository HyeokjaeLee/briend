'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { useState } from 'react';
import { RiHome3Fill, RiMessage2Line } from 'react-icons/ri';

import { CustomButton, Lottie } from '@/components';
import { ROUTES } from '@/routes/client';
import { ERROR_STATUS } from '@/utils';

import { useTranslation } from '../i18n/client';

import CommonErrorLottie from './_assets/common-error.json';
import TimeErrorLottie from './_assets/time-error.json';
import UnauthErrorLottie from './_assets/unauth-error.json';

const ErrorPage = (e: { error: Error }) => {
  const [errorStatus] = e.error.message.match(/<[^>]+>/g) ?? [];

  const errorStatusNumber = errorStatus
    ? Number(errorStatus.slice(1, -1))
    : null;

  const { t } = useTranslation('error');

  const isLogined = !!useSession();

  const dynamicInfo = {
    lottie: CommonErrorLottie as unknown,
    text: t('unknown-error'),
    buttonIcon: <RiHome3Fill />,
    buttonText: t('home-button-text'),
    buttonLink: ROUTES.FRIEND_LIST.pathname,
  };

  switch (errorStatusNumber) {
    case ERROR_STATUS.UNAUTHORIZED: {
      dynamicInfo.lottie = UnauthErrorLottie;
      dynamicInfo.text = t('not-allowed');

      break;
    }
    case ERROR_STATUS.EXPIRED_CHAT: {
      dynamicInfo.lottie = TimeErrorLottie;
      dynamicInfo.text = t('expired-chat');
      dynamicInfo.buttonIcon = <RiMessage2Line />;

      if (isLogined) {
        dynamicInfo.buttonText = t('create-chat-button-text');
        dynamicInfo.buttonLink = ROUTES.INVITE_CHAT.pathname;
      }
    }
  }

  const [containerElement, setContainerElement] = useState<HTMLElement | null>(
    null,
  );

  return (
    <article
      ref={setContainerElement}
      className="flex-1 flex-col gap-8 flex-center"
    >
      <Lottie loop animationData={dynamicInfo.lottie} className="w-2/3" />
      <h1 className="whitespace-pre-line text-center text-xl font-semibold">
        {dynamicInfo.text}
      </h1>
      <CustomButton
        asChild
        activeScaleDown={false}
        className="fixed bottom-0 h-17 w-full max-w-screen-sm rounded-none"
        color="red"
        style={{
          width: containerElement?.clientWidth,
        }}
      >
        <Link replace className="z-10" href={dynamicInfo.buttonLink}>
          <div className="mt-1">{dynamicInfo.buttonIcon}</div>
          {dynamicInfo.buttonText}
        </Link>
      </CustomButton>
    </article>
  );
};

export default ErrorPage;
