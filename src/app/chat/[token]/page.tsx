'use client';

import { MessageList } from './components/MessageList';
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
      <MessageList />
      <SendMessageForm />
    </main>
  );
};

export default ChatPage;
