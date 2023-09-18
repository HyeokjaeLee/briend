import { Channel } from 'pusher-js';
import { createWithEqualityFn } from 'zustand/traditional';

import type { ChattingRoomDB } from '@/database/chattingRoom';
import { createChattingRoomDB } from '@/database/chattingRoom';
import { ChattingRoom, LastMessage, Message } from '@/types';

interface ChattingRoomStore {
  isMounted: boolean;
  mountDB: (userId?: string | null) => void;

  chattingRoomList?: ChattingRoom[];
  lastMessageList?: LastMessage[];
  addChattingRoom: (chattingRoom: ChattingRoom) => void;
  deleteChattingRoom: (token: string) => void;

  chattingRoom?:
    | (ChattingRoom & {
        channel: Channel;
      })
    | null;

  setChattingRoom: (params: { token: string; channel: Channel } | null) => void;

  messageList?: Message[] | null;
  addMessage: (message: Message) => void;
}

export const useChattingRoomStore = createWithEqualityFn<ChattingRoomStore>(
  (set, get) => {
    let chattingRoomDB: ChattingRoomDB | undefined;

    return {
      isMounted: false,
      mountDB: async (userId?: string | null) => {
        chattingRoomDB = await createChattingRoomDB(`${userId ?? 'guest'}-db`);

        const chattingRoomList = await chattingRoomDB.getChattingRoomList();

        const lastMessageList = await chattingRoomDB.getLastMessageList();

        set({ chattingRoomList, lastMessageList, isMounted: true });
      },

      addChattingRoom: async (chattingRoom) => {
        if (!chattingRoomDB)
          throw new Error('chattingRoomDB가 존재하지 않습니다.');

        const chattingRoomList = await chattingRoomDB.addChattingRoom(
          chattingRoom,
        );

        const { lastMessageList } = await chattingRoomDB.createMessageStore(
          chattingRoom.token,
        );

        set({ chattingRoomList, lastMessageList });
      },

      deleteChattingRoom: async (token) => {
        if (!chattingRoomDB)
          throw new Error('chattingRoomDB가 존재하지 않습니다.');

        const lastMessageList = await chattingRoomDB.deleteMessageStore(token);
        const chattingRoomList = await chattingRoomDB.deleteChattingRoom(token);

        set({ chattingRoomList, lastMessageList });
      },

      setChattingRoom: async (params) => {
        if (!chattingRoomDB)
          throw new Error('chattingRoomDB가 존재하지 않습니다.');

        if (params) {
          const { channel, token } = params;

          const { chattingRoomList } = get();

          const chattingRoom = chattingRoomList?.find(
            (chattingRoom) => chattingRoom.token === token,
          );

          if (!chattingRoom) throw new Error('존재하지 않는 채팅방입니다.');

          const messageList = await chattingRoomDB.getMessageList(token);

          return set({
            chattingRoom: { ...chattingRoom, channel },
            messageList,
          });
        }

        set({ chattingRoom: null, messageList: null });
      },

      addMessage: async (message) => {
        if (!chattingRoomDB)
          throw new Error('chattingRoomDB가 존재하지 않습니다.');

        const { chattingRoom } = get();

        if (!chattingRoom) throw new Error('chattingRoom이 존재하지 않습니다.');

        const { token } = chattingRoom;

        const messageData = await chattingRoomDB.addMessage(token, message);

        set(messageData);
      },
    };
  },
  Object.is,
);
