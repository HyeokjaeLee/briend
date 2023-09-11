'use client';

import { decodeChattingRoomToken } from '@/utils';

import { useBindChattingRoomInfo } from './hooks/useBindChattingRoomInfo';
import { useJoinChannel } from './hooks/useJoinChannel';

interface InviteQrPageProps {
  params: {
    token: string;
  };
}

const ChatPage = ({ params: { token } }: InviteQrPageProps) => {
  useBindChattingRoomInfo(token);
  useJoinChannel();

  return <></>;
};

export default ChatPage;
