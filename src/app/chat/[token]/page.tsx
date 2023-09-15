'use client';

import { ChattingList } from './components/ChattingList';
import { SendMessageForm } from './components/SendMessageForm';
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

  return (
    <main>
      <ChattingList />
      <SendMessageForm />
    </main>
  );
};

export default ChatPage;
