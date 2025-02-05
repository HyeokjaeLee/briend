'use client';

import { InviteChatQRTemplate } from './_components/InviteChatQRTemplate';

interface InviteChatQRSideProps {
  inviteToken: string;
}

export const InviteChatQRSide = ({ inviteToken }: InviteChatQRSideProps) => {
  return <InviteChatQRTemplate isSidePanel inviteToken={inviteToken} />;
};
