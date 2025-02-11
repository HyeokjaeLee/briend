'use client';

import { InviteChatTemplate } from './_components/InviteChatTemplate';

interface InviteChatQRSideProps {
  inviteToken: string;
}

export const InviteChatQRSide = ({ inviteToken }: InviteChatQRSideProps) => {
  return <InviteChatTemplate isSidePanel inviteToken={inviteToken} />;
};
