'use client';

import Image from 'next/image';

import { useTranslation } from '@/app/i18n/client';
import { LOGIN_PROVIDERS } from '@/constants/etc';
import { useGlobalStore } from '@/stores/global';
import { cn } from '@/utils/cn';

export interface LoginButtonContentsProps {
  provider: LOGIN_PROVIDERS;
  fullSize?: boolean;
}

export const LoginButtonContents = ({
  provider,
  fullSize,
}: LoginButtonContentsProps) => {
  const { t } = useTranslation('login');
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  return (
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
      onClick={() => setIsLoading(true)}
    >
      <div
        className={
          fullSize ? 'flex w-full max-w-44 items-center gap-2' : 'size-fit'
        }
      >
        <Image
          alt={`${provider}-login`}
          height={28}
          loading="eager"
          src={`/assets/login/${provider}.png`}
          width={28}
        />
        {fullSize ? t(`${provider}-login`) : null}
      </div>
    </button>
  );
};
