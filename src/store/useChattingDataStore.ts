import { Channel } from 'pusher-js';
import { createWithEqualityFn } from 'zustand/traditional';

import type { ChattingDataDB, LastMessage } from '@/database/chattingData';
import { createChattingDataDB } from '@/database/chattingData';
import { ChattingRoom, Message } from '@/types';

interface ChattingDatraStore {
  isMounted: boolean;
  mountDB: (userId?: string | null) => void;

  chattingRoomList: ChattingRoom[];

  lastMessageList: LastMessage[];

  createChattingRoom: (chattingRoom: ChattingRoom) => void;

  deleteChattingRoom: (token: string) => void;

  chattingRoom?:
    | (ChattingRoom & {
        channel: Channel;
        isExpired: boolean;
      })
    | null;

  messageList?: Message[] | null;

  setChattingRoom: (params: { token: string; channel: Channel } | null) => void;
  expireChattingRoom: () => void;

  addMessage: (message: Message) => void;
}

export const useChattingDataStore = createWithEqualityFn<ChattingDatraStore>(
  (set, get) => {
    let chattingDataDB: ChattingDataDB | undefined;

    return {
      isMounted: false,
      mountDB: async (userId) => {
        chattingDataDB = await createChattingDataDB(`${userId ?? 'guest'}-db`);

        const data = await chattingDataDB.getAllChattingRoomAndLastMessage();

        return set({ ...data, isMounted: true });
      },

      chattingRoomList: [],

      lastMessageList: [],

      createChattingRoom: async (chattingRoom) => {
        const {
          chattingRoomList: prevChattingRoomList,
          lastMessageList: prevLastMessageList,
        } = get();

        if (!chattingDataDB)
          throw new Error('chattingDataDB가 존재하지 않습니다.');

        const { lastMessage } = await chattingDataDB.createChattingData(
          chattingRoom,
        );

        return set({
          chattingRoomList: [...prevChattingRoomList, chattingRoom],
          lastMessageList: [...prevLastMessageList, lastMessage],
        });
      },

      deleteChattingRoom: async (token) => {
        if (!chattingDataDB)
          throw new Error('chattingDataDB가 존재하지 않습니다.');

        await chattingDataDB.deleteChattingData(token);

        const {
          chattingRoomList: prevChattingRoomList,
          lastMessageList: prevLastMessageList,
        } = get();

        return set({
          chattingRoomList: prevChattingRoomList.filter(
            (chattingRoom) => chattingRoom.token !== token,
          ),

          lastMessageList: prevLastMessageList.filter(
            (lastMessage) => lastMessage.token !== token,
          ),
        });
      },

      setChattingRoom: async (params) => {
        if (params) {
          const { channel, token } = params;

          const { chattingRoomList } = get();

          const chattingRoom = chattingRoomList?.find(
            (chattingRoom) => chattingRoom.token === token,
          );

          if (!chattingRoom) throw new Error('존재하지 않는 채팅방입니다.');

          if (!chattingDataDB)
            throw new Error('chattingDataDB가 존재하지 않습니다.');
          const { messageList } = await chattingDataDB.getMessageData(token);

          const isExpired = chattingRoom.endAt < new Date();

          return set({
            chattingRoom: { ...chattingRoom, channel, isExpired },
            messageList,
          });
        }

        set({ chattingRoom: null, messageList: null });
      },

      expireChattingRoom: () =>
        set(({ chattingRoom }) => ({
          chattingRoom: chattingRoom && { ...chattingRoom, isExpired: true },
        })),

      addMessage: async (message) => {
        const {
          messageList: prevMessageList,
          lastMessageList: prevLastMessageList,
          chattingRoom,
        } = get();

        if (!chattingRoom || !prevMessageList)
          throw new Error('존재하지 않는 채팅방입니다.');

        if (!chattingDataDB)
          throw new Error('chattingDataDB가 존재하지 않습니다.');

        const {
          messageData: { messageList, token },
        } = await chattingDataDB.updateMessageData({
          token: chattingRoom.token,
          messageList: [...prevMessageList, message],
        });

        return set({
          messageList,
          lastMessageList: prevLastMessageList.map((lastMessage) =>
            lastMessage.token === token
              ? ({
                  token,
                  message,
                } satisfies LastMessage)
              : lastMessage,
          ),
        });
      },
    };
  },
  Object.is,
);
