'use client';

import { redirect } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import { PageLoadingTemplate } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { LOGIN_PROVIDERS } from '@/constants';
import { ROUTES } from '@/routes/client';
import Logo from '@/svgs/logo.svg';
import { assertEnum } from '@/utils';

import { LoginButton } from './_components/LoginButton';

const LOGIN_BUTTON_NAME = 'provider';

const LoginPage = () => {
  const { t } = useTranslation('login');
  const { status } = useSession();

  const handleSignIn = (provider: LOGIN_PROVIDERS) => {
    assertEnum(LOGIN_PROVIDERS, provider);
    signIn(provider, { callbackUrl: ROUTES.FRIEND_LIST.pathname });
  };

  if (status === 'loading') {
    return <PageLoadingTemplate />;
  }

  if (status === 'authenticated') {
    redirect(ROUTES.FRIEND_LIST.pathname);
  }

  return (
    <article className="flex flex-1 flex-col justify-between px-4 py-8">
      <header className="flex flex-1 flex-col items-center justify-center gap-2">
        <Logo className="w-40" />
        <h1 className="ml-2 text-lg font-semibold">{t('title')}</h1>
      </header>
      <div>
        <LoginButton
          fullSize
          name={LOGIN_BUTTON_NAME}
          provider={LOGIN_PROVIDERS.GOOGLE}
          text={t('google-login')}
          onClick={() => handleSignIn(LOGIN_PROVIDERS.GOOGLE)}
        />
        <div className="flex-center m-4 gap-2 text-slate-300">
          <hr className="flex-1 border-slate-300" />
          또는
          <hr className="flex-1 border-slate-300" />
        </div>
        <section className="flex-center gap-4">
          <LoginButton
            name={LOGIN_BUTTON_NAME}
            provider={LOGIN_PROVIDERS.KAKAO}
            text={t('kakao-login')}
            onClick={() => handleSignIn(LOGIN_PROVIDERS.KAKAO)}
          />
          <LoginButton
            name={LOGIN_BUTTON_NAME}
            provider={LOGIN_PROVIDERS.NAVER}
            text={t('naver-login')}
            onClick={() => handleSignIn(LOGIN_PROVIDERS.NAVER)}
          />
        </section>
      </div>
    </article>
  );
};

export default LoginPage;
