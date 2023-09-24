'use client';

import { useAuthStore } from '@/store/useAuthStore';

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
  const isBinded = useAuthStore((state) => state.isBinded);
  useBindChattingRoom(token);

  useJoinChannel();

  return isBinded ? (
    <>
      <article className="flex flex-col h-full">
        <MessageList />
        <SendMessageForm />
      </article>
    </>
  ) : null;
};

export default ChatPage;
