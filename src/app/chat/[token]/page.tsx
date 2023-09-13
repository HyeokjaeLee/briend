'use client';

import { useBindChattingRoom } from './hooks/useBindChattingRoom';
import { useJoinChannel } from './hooks/useJoinChannel';

interface InviteQrPageProps {
  params: {
    token: string;
  };
}

const ChatPage = ({ params: { token } }: InviteQrPageProps) => {
  useBindChattingRoom(token);

  useJoinChannel();

  return <></>;
};

export default ChatPage;
