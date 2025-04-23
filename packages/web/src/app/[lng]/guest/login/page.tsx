import { Logo } from '@/components';
import { signIn } from '@/configs/auth';
import { getTranslation } from '@/configs/i18n/server';
import { type LANGUAGE, LOGIN_PROVIDERS } from '@/constants';
import { assertEnum } from '@/utils';

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

          assertEnum(LOGIN_PROVIDERS, provider);

          await signIn(provider);
        }}
      >
        <LoginButton
          fullSize
          name={LOGIN_BUTTON_NAME}
          provider={LOGIN_PROVIDERS.GOOGLE}
          text={t('google-login')}
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
