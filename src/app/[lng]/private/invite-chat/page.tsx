import { getTranslation } from '@/app/i18n/server';
import { Lottie } from '@/components/atoms/Lottie';
import type { LANGUAGE } from '@/constants/language';

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
    <article className="flex flex-1 flex-col items-center justify-between p-4">
      <section className="flex-1 flex-col flex-center">
        <Lottie
          loop
          animationData={inviteFriendLottie}
          className="mx-auto size-96"
        />
        <p className="text-center text-lg text-slate-500">
          {t('friend-setting-message')}
        </p>
      </section>
      <InviteForm />
    </article>
  );
};

export default CreateChatPage;
