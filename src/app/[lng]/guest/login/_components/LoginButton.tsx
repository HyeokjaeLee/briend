import Image from 'next/image';

import { useTranslation } from '@/app/i18n/server';
import { signIn } from '@/auth';
import { LOGIN_PROVIDERS } from '@/constants/\betc';
import type { LANGUAGE } from '@/constants/language';
import { cn } from '@/utils/cn';

interface LoginButtonProps {
  provider: LOGIN_PROVIDERS;
  fullSize?: boolean;
  lng: LANGUAGE;
}

export const LoginButton = async ({
  provider,
  fullSize = false,
  lng,
}: LoginButtonProps) => {
  const { t } = await useTranslation('login', lng);

  return (
    <form
      action={async () => {
        'use server';

        await signIn(provider);
      }}
      className={cn('h-14', {
        'w-full': fullSize,
      })}
    >
      <button
        className={cn(
          'flex-center',
          fullSize
            ? 'font-semibold rounded-lg px-7 text-lg size-full'
            : 'h-full w-14 rounded-full',
          {
            [LOGIN_PROVIDERS.GOOGLE]: 'bg-white text-slate-850',
            [LOGIN_PROVIDERS.KAKAO]: 'bg-kakao-yellow text-slate-850',
            [LOGIN_PROVIDERS.NAVER]: 'bg-naver-green',
          }[provider],
        )}
      >
        <div
          className={
            fullSize ? 'flex w-full max-w-44 items-center gap-2' : 'size-fit'
          }
        >
          <Image
            alt={`${provider}-login`}
            height={28}
            src={`/assets/login/${provider}.png`}
            width={28}
          />
          {fullSize ? t(`${provider}-login`) : null}
        </div>
      </button>
    </form>
  );
};
