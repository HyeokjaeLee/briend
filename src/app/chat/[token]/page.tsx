'use client';

import { decodeChattingRoomToken } from '@/utils';

import { useJoinChannel } from './hooks/useJoinChannel';

interface InviteQrPageProps {
  params: {
    token: string;
  };
}

const ChatPage = ({ params: { token } }: InviteQrPageProps) => {
  useJoinChannel(token);

  return <></>;
};

export default ChatPage;
