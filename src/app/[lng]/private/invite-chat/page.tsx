import { getTranslation } from '@/app/i18n/server';
import { Lottie } from '@/components';
import type { LANGUAGE } from '@/constants';

import inviteFriendLottie from './_assets/invite-friend.json';
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
      <Lottie
        loop
        animationData={inviteFriendLottie}
        className="m-auto h-[calc(var(--content-height)-28rem)] w-auto max-w-96"
      />
      <p className="text-center text-sm text-slate-500">
        {t('friend-setting-message')}
      </p>
      <InviteForm />
    </article>
  );
};

export default CreateChatPage;
