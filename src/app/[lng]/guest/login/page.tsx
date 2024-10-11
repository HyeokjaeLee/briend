import Image from 'next/image';

import { useTranslation } from '@/app/i18n/server';
import { signIn } from '@/auth';
import type { LANGUAGE } from '@/constants/language';
import Logo from '@/svgs/logo.svg';
import { cn } from '@/utils/cn';

const SOCIAL_LOGIN_PROVIDERS = ['google', 'apple', 'kakao', 'naver'] as const;

interface LoginPageProps {
  params: {
    lng: LANGUAGE;
  };
}

const LoginPage = async ({ params: { lng } }: LoginPageProps) => {
  const { t } = await useTranslation('login', lng);

  return (
    <article className="flex flex-1 flex-col justify-between px-4 py-16">
      <header className="flex flex-1 flex-col items-center justify-center gap-2">
        <Logo className="w-52" />
        <h1 className="ml-2 text-xl font-semibold">{t('title')}</h1>
      </header>
      <section className="flex flex-col gap-4">
        {SOCIAL_LOGIN_PROVIDERS.map((name) => (
          <form
            key={name}
            action={async (data) => {
              'use server';
            }}
            className="w-full"
          >
            <button
              className={cn(
                'h-14 flex-center font-semibold rounded-lg px-7 text-lg',
                {
                  google: 'bg-white text-slate-850',
                  kakao: 'bg-kakao-yellow text-slate-850',
                  apple: 'bg-zinc-950 border border-zinc-700',
                  naver: 'bg-naver-green',
                }[name],
              )}
              onClick={async () => {
                'use server';
              }}
            >
              <div className="flex w-full max-w-44 items-center gap-2">
                <Image
                  alt={`${name}-login`}
                  height={28}
                  src={`/assets/login/${name}.png`}
                  width={28}
                />
                {t(`${name}-login`)}
              </div>
            </button>
          </form>
        ))}
      </section>
    </article>
  );
};

export default LoginPage;
