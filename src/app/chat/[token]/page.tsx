'use client';

import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';
import { SendingMessageDrawer } from './components/SendingMessageDrawer';
import { useBindChattingRoom } from './hooks/useBindChattingRoom';
import { useJoinChannel } from './hooks/useJoinChannel';

export interface ChatPageProps {
  params: {
    token: string;
  };
}

const ChatPage = ({ params: { token } }: ChatPageProps) => {
  useBindChattingRoom(token);

  useJoinChannel();

  return (
    <main>
      <MessageList />
      <SendMessageForm />
      <SendingMessageDrawer />
    </main>
  );
};

export default ChatPage;
