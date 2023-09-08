import { createWithEqualityFn } from 'zustand/traditional';

import type { ChattingRoom, Message } from '@/types';

import type { Channel } from 'pusher-js';

interface ChattingRoomStore {
  channel?: Channel;
  setChannel: (channel: Channel) => void;

  chattingRoom?: ChattingRoom;
  setChattingRoom: (chattingRoom: ChattingRoom) => void;

  messageList: Message[];
  setMessageList: (
    token: string,
    messageList: (prevMessageList: Message[]) => Message[],
  ) => void;
}

export const useChattingRoomStore = createWithEqualityFn<ChattingRoomStore>(
  (set) => ({
    setChannel: (channel) => set({ channel }),

    setChattingRoom: (chattingRoom) =>
      set({
        chattingRoom,
      }),

    messageList: [],
    setMessageList: (token, messageList) =>
      set((state) => {
        const newMessageList = messageList(state.messageList);

        localStorage.setItem(token, JSON.stringify(newMessageList));

        return {
          messageList: newMessageList,
        };
      }),
  }),
  Object.is,
);
