import { getTranslation } from '@/app/i18n/server';
import { DotLottie } from '@/components';
import type { LANGUAGE } from '@/constants';

import { InviteForm } from './_components/InviteForm';

interface CreateChatPageProps {
  params: Promise<{
    lng: LANGUAGE;
  }>;
}

const CreateChatPage = async ({ params }: CreateChatPageProps) => {
  const { lng } = await params;

  const { t } = await getTranslation('invite-chat', lng);

  return (
    <article className="flex flex-1 flex-col gap-4 p-4">
      <DotLottie
        className="my-auto"
        src="/assets/lottie/invite-friend.lottie"
      />
      <p className="text-center text-sm text-slate-500">
        {t('friend-setting-message')}
      </p>
      <InviteForm />
    </article>
  );
};

export default CreateChatPage;
