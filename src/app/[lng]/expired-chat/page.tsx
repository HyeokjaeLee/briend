'use client';

import { useTranslation } from '@/app/i18n/client';
import { CustomBottomNav } from '@/components/CustomBottomNav';
import { CustomButton } from '@/components/CustomButton';
import { CustomLink } from '@/components/CustomLink';
import { ROUTES } from '@/routes/client';

const ExpiredChatPage = () => {
  const { t } = useTranslation('expired-chat');

  return (
    <article className="flex flex-1 flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <div className="text-6xl">⏳</div>
      <p className="whitespace-pre-line text-center">{t('notice-message')}</p>
      <CustomBottomNav>
        <CustomButton asChild className="w-full" size="4">
          <CustomLink replace href={ROUTES.INVITE_CHAT.pathname}>
            {t('button-text')}
          </CustomLink>
        </CustomButton>
      </CustomBottomNav>
    </article>
  );
};

export default ExpiredChatPage;
