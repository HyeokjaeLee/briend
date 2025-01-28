'use client';

import Image from 'next/image';

import { LOGIN_PROVIDERS } from '@/constants';
import { useGlobalStore } from '@/stores';
import { cn } from '@/utils';

export interface LoginButtonProps {
  provider: LOGIN_PROVIDERS;
  fullSize?: boolean;
  text?: string;
  name: string;
}

export const LoginButton = ({
  provider,
  fullSize,
  text,
  name,
}: LoginButtonProps) => {
  const setLoading = useGlobalStore((state) => state.setGlobalLoading);

  return (
    <button
      className={cn(
        'flex-center h-14',
        fullSize
          ? 'font-semibold rounded-lg px-7 text-lg w-full'
          : 'w-14 rounded-full',
        {
          [LOGIN_PROVIDERS.GOOGLE]:
            'bg-white text-slate-850 border-slate-200 border',
          [LOGIN_PROVIDERS.KAKAO]: 'bg-kakao-yellow text-slate-850',
          [LOGIN_PROVIDERS.NAVER]: 'bg-naver-green',
        }[provider],
      )}
      name={name}
      value={provider}
      onClick={() => {
        setLoading(true);
      }}
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
        {fullSize ? text : null}
      </div>
    </button>
  );
};
