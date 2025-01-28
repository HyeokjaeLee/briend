import { getTranslation } from '@/app/i18n/server';
import { signIn } from '@/auth';
import { LOGIN_PROVIDERS, type LANGUAGE } from '@/constants';
import Logo from '@/svgs/logo.svg';
import { CustomError, isEnumValue } from '@/utils';

import { LoginButton } from './_components/LoginButton';

interface LoginPageProps {
  params: Promise<{
    lng: LANGUAGE;
  }>;
}

const LOGIN_BUTTON_NAME = 'provider';

const LoginPage = async (props: LoginPageProps) => {
  const params = await props.params;

  const { t } = await getTranslation('login', params.lng);

  return (
    <article className="flex flex-1 flex-col justify-between px-4 py-8">
      <header className="flex flex-1 flex-col items-center justify-center gap-2">
        <Logo className="w-40" />
        <h1 className="ml-2 text-lg font-semibold">{t('title')}</h1>
      </header>
      <form
        action={async (formData) => {
          'use server';

          const provider = formData.get(LOGIN_BUTTON_NAME);

          if (!isEnumValue(LOGIN_PROVIDERS, provider)) throw new CustomError();

          await signIn(provider);
        }}
      >
        <LoginButton
          fullSize
          name={LOGIN_BUTTON_NAME}
          provider={LOGIN_PROVIDERS.GOOGLE}
          text={t('google-login')}
        />
        <div className="m-4 gap-2 text-slate-300 flex-center">
          <hr className="flex-1 border-slate-300" />
          또는
          <hr className="flex-1 border-slate-300" />
        </div>
        <section className="gap-4 flex-center">
          <LoginButton
            name={LOGIN_BUTTON_NAME}
            provider={LOGIN_PROVIDERS.KAKAO}
            text={t('kakao-login')}
          />
          <LoginButton
            name={LOGIN_BUTTON_NAME}
            provider={LOGIN_PROVIDERS.NAVER}
            text={t('naver-login')}
          />
        </section>
      </form>
    </article>
  );
};

export default LoginPage;
