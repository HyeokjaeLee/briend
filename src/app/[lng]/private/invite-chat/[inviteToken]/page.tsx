'use client';

import { decodeJwt } from 'jose';

import type { InviteTokenPayload } from '@/app/api/chat/create/route';
import { useTranslation } from '@/app/i18n/client';
import { CustomBottomNav } from '@/components/CustomBottomNav';
import { Timer } from '@/components/Timer';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { toast } from '@/utils';

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
            router.back();
          }}
        />
      </CustomBottomNav>
    </>
  );
};

export default InviteChatQRPage;
