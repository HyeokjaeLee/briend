import { useTranslation } from 'react-i18next';

import { CustomLink, DotLottie } from '@/components';
import { ROUTES } from '@/routes/client';

export const GuestBanner = () => {
  const { t } = useTranslation('friend-list');

  return (
    <CustomLink
      className="relative flex animate-fade-down items-center gap-4 px-5 py-4 animate-duration-150"
      href={ROUTES.LOGIN.pathname}
    >
      <DotLottie
        className="h-20 w-24"
        src="/assets/lottie/phone-message.lottie"
      />
      <div>
        <strong className="text-lg font-semibold">{t('login-rending1')}</strong>
        <p className="text-zinc-500">{t('login-rending2')}</p>
      </div>
    </CustomLink>
  );
};
