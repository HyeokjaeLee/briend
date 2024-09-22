import { useTranslation } from '@/app/i18n/server';
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
    <article className="flex flex-1 flex-col items-center justify-between p-5">
      <p className="break-keep rounded-lg bg-slate-100 px-4 py-2 text-lg">
        📢 {t('friend-setting-message')}
      </p>
      <InviteForm />
    </article>
  );
};

export default CreateChatPage;

export const dynamic = 'force-static';
