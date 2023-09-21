'use client';

import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';
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
    <>
      <article className="flex flex-col h-full">
        <MessageList />
        <SendMessageForm />
      </article>
    </>
  );
};

export default ChatPage;
