'use client';

import { ChatQueryOptions } from '@/app/query-options/chat';
import { ROUTES } from '@/routes/client';
import { TOKEN_TYPE } from '@/types/jwt';
import { useSuspenseQuery } from '@tanstack/react-query';

import { InviteChatQRTemplate } from './_components/InviteChatQrTemplate';

interface InviteChatQRSideProps {
  inviteToken: string;
}

export const InviteChatQRSide = (props: InviteChatQRSideProps) => {
  const { inviteToken } = props;

  const verifyInviteTokenQuery = useSuspenseQuery(
    ChatQueryOptions.verifyChatToken({
      token: inviteToken,
      tokenType: TOKEN_TYPE.INVITE,
    }),
  );

  const { payload } = verifyInviteTokenQuery.data;

  return (
    <InviteChatQRTemplate
      isSidePanel
      exp={payload.exp}
      guestLanguage={payload.guestLanguage}
      hostId={payload.hostId}
      inviteToken={inviteToken}
      url={
        ROUTES.JOIN_CHAT.url({
          lng: payload.guestLanguage,
          searchParams: {
            inviteToken,
          },
        }).href
      }
    />
  );
};
