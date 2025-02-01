'use client';

import { InviteChatQRTemplate } from './_components/InviteChatQrTemplate';

interface InviteChatQRSideProps {
  inviteToken: string;
}

export const InviteChatQRSide = ({ inviteToken }: InviteChatQRSideProps) => {
  return <InviteChatQRTemplate isSidePanel inviteToken={inviteToken} />;
};
