'use client';

import Image from 'next/image';

import type { LOGIN_PROVIDERS } from '@/constants';
import { LOGIN_PROVIDERS as P } from '@/constants';
import { cn } from '@/utils';

export interface LoginButtonProps
  extends React.ComponentPropsWithoutRef<'button'> {
  provider: LOGIN_PROVIDERS;
  fullSize?: boolean;
  text?: string;
}

export const LoginButton = ({
  provider,
  fullSize,
  text,
  ...rest
}: LoginButtonProps) => {
  return (
    <button
      {...rest}
      className={cn(
        'flex-center h-14 cursor-pointer',
        fullSize
          ? 'font-pretendard w-full rounded-lg px-7 text-lg font-semibold'
          : 'w-14 rounded-full',
        {
          [P.GOOGLE]: 'text-slate-850 border border-slate-200 bg-white',
          [P.KAKAO]: 'bg-kakao-yellow text-slate-850',
          [P.NAVER]: 'bg-naver-green',
        }[provider],
      )}
      value={provider}
    >
      <div
        className={
          fullSize
            ? 'flex w-full max-w-44 items-center gap-2 text-nowrap'
            : 'size-fit'
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
