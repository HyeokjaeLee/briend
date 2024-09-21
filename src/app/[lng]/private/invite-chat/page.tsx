import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

import { useTranslation } from '@/app/i18n/server';
import { pusher } from '@/app/pusher/client';
import { CustomButton } from '@/components/CustomButton';
import { CustomTopHeader } from '@/components/CustomTopHeader';
import { COOKIES } from '@/constants/cookies-key';
import type { LANGUAGE } from '@/constants/language';

import { InviteForm } from './_components/InviteForm';
interface CreateChatPageProps {
  params: {
    lng: LANGUAGE;
  };
}

const CreateChatPage = async ({ params: { lng } }: CreateChatPageProps) => {
  const { t } = await useTranslation('invite-chat', lng);

  return (
    <article className="flex flex-1 flex-col items-center justify-center p-5">
      <CustomTopHeader>
        <h1 className="text-2xl font-bold">👋 {t('invite-title')}</h1>
      </CustomTopHeader>
      <section>
        <p className="break-keep text-center text-xl">
          {t('friend-setting-message')}
        </p>
        <InviteForm />
      </section>
    </article>
  );
};

export default CreateChatPage;

export const dynamic = 'force-static';
