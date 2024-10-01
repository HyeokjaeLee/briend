'use client';

import { decodeJwt } from 'jose';

import { useEffect } from 'react';

import type { InviteTokenPayload } from '@/app/api/chat/create/route';
import { useTranslation } from '@/app/i18n/client';
import { pusher } from '@/app/pusher/client';
import { CustomBottomNav } from '@/components/CustomBottomNav';
import { Timer } from '@/components/Timer';
import { CHANNEL } from '@/constants/channel';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { toast } from '@/utils/toast';

import { InviteQRSection } from './_components/InviteQRSection';

interface InviteChatQRPageProps {
  params: {
    inviteToken: string;
  };
}

const InviteChatQRPage = ({
  params: { inviteToken },
}: InviteChatQRPageProps) => {
  const payload = decodeJwt<InviteTokenPayload>(inviteToken);

  const expires = new Date((payload.exp ?? 0) * 1_000);

  const router = useCustomRouter();

  const { t } = useTranslation('invite-chat-qr');

  useEffect(() => {
    const channel = pusher.subscribe(CHANNEL.WAITING);

    channel.bind(payload.hostId, (data) => {
      console.log(data);
    });
  }, []);

  return (
    <>
      <InviteQRSection inviteToken={inviteToken} language={payload.language} />
      <CustomBottomNav className="flex justify-center">
        <Timer
          expires={expires}
          onTimeout={() => {
            toast({
              message: t('expired-toast-message'),
            });

            router.replace(ROUTES.EXPIRED_CHAT.pathname);
          }}
        />
      </CustomBottomNav>
    </>
  );
};

export default InviteChatQRPage;
