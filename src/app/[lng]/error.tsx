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

import { BottomButton } from '@/components/molecules/BottomButton';
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

  return (
    <article className="flex-1 flex-col gap-8 p-4 flex-center">
      <div>
        {(() => {
          switch (errorStatusNumber) {
            case ERROR_STATUS.UNAUTHORIZED:
              return <RiLock2Line className="size-32 text-slate-50" />;
            case ERROR_STATUS.EXPIRED_CHAT:
              return <RiAlarmLine className="size-32 text-red-500" />;

            default:
              return <RiErrorWarningFill className="size-32 text-red-500" />;
          }
        })()}
        <p
          className={cn('text-2xl font-bold text-center text-red-500', {
            'text-slate-50': errorStatusNumber === ERROR_STATUS.UNAUTHORIZED,
          })}
        >
          {errorStatusNumber || 500}
        </p>
      </div>
      <h1 className="whitespace-pre-line text-center text-xl font-semibold">
        {(() => {
          switch (errorStatusNumber) {
            case ERROR_STATUS.UNAUTHORIZED:
              return t('not-allowed');
            case ERROR_STATUS.EXPIRED_CHAT:
              return t('expired-chat');

            default:
              return t('unknown-error');
          }
        })()}
      </h1>
      <BottomButton asChild color="red">
        {(() => {
          switch (errorStatusNumber) {
            case ERROR_STATUS.EXPIRED_CHAT:
              return isLogined ? (
                <Link replace href={ROUTES.INVITE_CHAT.pathname}>
                  <RiMessage2Line />
                  {t('create-chat-button-text')}
                </Link>
              ) : (
                <Link replace href={ROUTES.HOME.pathname}>
                  <RiHome3Fill />
                  {t('home-button-text')}
                </Link>
              );

            default:
              return (
                <Link replace href={ROUTES.HOME.pathname}>
                  <RiHome3Fill />
                  {t('home-button-text')}
                </Link>
              );
          }
        })()}
      </BottomButton>
    </article>
  );
};

export default ErrorPage;
