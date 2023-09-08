'use client';

import { shallow } from 'zustand/shallow';

import { AddChattingRoomModal } from '@/components/AddChattingRoomModal';
import { EmptyChattingListTemplate } from '@/components/EmptyChattingListTemplate';
import { SendMessageForm } from '@/components/SendMessageForm';
import { LANGUAGE } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useChattingRoomStore } from '@/store/useChattingRoomStore';

const ChatPage = () => {
  const [isLogin] = useAuthStore((state) => [state.isLogin], shallow);

  const isChattingRoomExist = useChattingRoomStore(
    (state) => state.chattingRoomMap.size > 0,
  );

  /**
   *   useEffect(() => {
    if (hostId && userName) {
      const { NEXT_PUBLIC_PUSHER_KEY } = process.env;
      if (!NEXT_PUBLIC_PUSHER_KEY) return;

      const pusher = new PusherJs(NEXT_PUBLIC_PUSHER_KEY, {
        cluster: 'ap3',
      });

      const receiveChannel = pusher.subscribe(`${hostId}-${userName}`);
      receiveChannel.bind('send-message', (data) => {
        alert(JSON.stringify(data));
      });
    }
  }, [hostId, userName]);
   */

  return isLogin ? (
    <main className="relative">
      {isChattingRoomExist ? <></> : <EmptyChattingListTemplate />}
      <AddChattingRoomModal />
      <SendMessageForm from="test" to="test2" language={LANGUAGE.KOREAN} />
    </main>
  ) : null;
};

export default ChatPage;

/**
     *    <ChattingList
        id={id}
        user={user}
        room={room}
        language={LANGUAGE.KOREAN}
      />
     
     */
