'use client';

import { getAuth } from 'firebase/auth';
import Image from 'next/image';

import { COOKIES, LOGIN_PROVIDERS } from '@/constants';
import { useCustomRouter } from '@/hooks';
import { useGlobalStore } from '@/stores';
import { cn, customCookies, CustomError } from '@/utils';

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

  const customRouter = useCustomRouter();

  return (
    <button
      data-slot="button"
      className={cn(
        'flex-center h-14 cursor-pointer',
        fullSize
          ? 'font-pretendard w-full rounded-lg px-7 text-lg font-semibold'
          : 'w-14 rounded-full',
        {
          [LOGIN_PROVIDERS.GOOGLE]:
            'text-slate-850 border border-slate-200 bg-white',
          [LOGIN_PROVIDERS.KAKAO]: 'bg-kakao-yellow text-slate-850',
          [LOGIN_PROVIDERS.NAVER]: 'bg-naver-green',
        }[provider],
      )}
      name={name}
      value={provider}
      onClick={(e) => {
        setLoading(true);

        const { currentUser } = getAuth();

        if (!currentUser?.isAnonymous) {
          e.preventDefault();

          throw new CustomError('is not anonymous');
        }

        customCookies.set(COOKIES.ANONYMOUS_ID, currentUser.uid);

        location.href = '/api/auth/external';
      }}
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
