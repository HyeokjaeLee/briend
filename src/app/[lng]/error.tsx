'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import {
  RiAlarmLine,
  RiErrorWarningFill,
  RiHome3Fill,
  RiLock2Line,
  RiMessage2Line,
} from 'react-icons/ri';

import { CustomButton } from '@/components/atoms/CustomButton';
import { ROUTES } from '@/routes/client';
import { cn } from '@/utils/cn';
import { ERROR_STATUS } from '@/utils/customError';

import { useTranslation } from '../i18n/client';

const ErrorPage = (e: { error: Error }) => {
  const [errorStatus] = e.error.message.match(/<[^>]+>/g) ?? [];
  const errorStatusNumber = errorStatus
    ? Number(errorStatus.slice(1, -1))
    : null;

  const { t } = useTranslation('error');

  const isLogined = !!useSession();

  const dynamicInfo = {
    icon: <RiErrorWarningFill className="size-32 text-red-500" />,
    text: t('home-button-text'),
    buttonIcon: <RiHome3Fill />,
    buttonText: t('home-button-text'),
    buttonLink: ROUTES.HOME.pathname,
  };

  switch (errorStatusNumber) {
    case ERROR_STATUS.UNAUTHORIZED: {
      dynamicInfo.icon = <RiLock2Line className="size-32 text-slate-50" />;
      dynamicInfo.text = t('not-allowed');

      break;
    }
    case ERROR_STATUS.EXPIRED_CHAT: {
      dynamicInfo.icon = <RiAlarmLine className="size-32 text-red-500" />;
      dynamicInfo.text = t('expired-chat');
      dynamicInfo.buttonIcon = <RiMessage2Line />;

      if (isLogined) {
        dynamicInfo.buttonText = t('create-chat-button-text');
        dynamicInfo.buttonLink = ROUTES.INVITE_CHAT.pathname;
      }
    }
  }

  return (
    <article className="flex-1 flex-col gap-8 flex-center">
      <div>
        {dynamicInfo.icon}
        <p
          className={cn('text-2xl font-bold text-center text-red-500', {
            'text-slate-50': errorStatusNumber === ERROR_STATUS.UNAUTHORIZED,
          })}
        >
          {errorStatusNumber || 500}
        </p>
      </div>
      <h1 className="whitespace-pre-line text-center text-xl font-semibold">
        {dynamicInfo.text}
      </h1>
      <CustomButton
        asChild
        className="fixed bottom-0 h-17 w-full max-w-xl rounded-none"
        color="red"
      >
        <Link replace href={dynamicInfo.buttonLink}>
          <div className="mt-1">{dynamicInfo.buttonIcon}</div>
          {dynamicInfo.buttonText}
        </Link>
      </CustomButton>
    </article>
  );
};

export default ErrorPage;
