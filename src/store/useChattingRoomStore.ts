import { createWithEqualityFn } from 'zustand/traditional';

import type { LANGUAGE } from '@/constants';
import type { Message } from '@/types';

import type { Channel } from 'pusher-js';

interface ChattingRoomInfo {
  isHost: boolean;
  token: string;
  userName: string;
  userLanguage: LANGUAGE;
  opponentName: string;
  opponentLanguage: LANGUAGE;
  channel: Channel;
  startAt: Date;
  endAt: Date;
}

interface ChattingRoomStore {
  info?: ChattingRoomInfo | null;
  setInfo: (info: ChattingRoomInfo | null) => void;

  messageList: Message[];
  setMessageList: (
    messageList: Message[] | ((prevMessageList: Message[]) => Message[]),
  ) => void;
}

export const useChattingRoomStore = createWithEqualityFn<ChattingRoomStore>(
  (set) => ({
    setInfo: (info) => set({ info }),

    messageList: [],
    setMessageList: (messageList) =>
      set(({ messageList: prevMessageList, info }) => {
        const { token } = info ?? {};
        const newMessageList =
          typeof messageList === 'function'
            ? messageList(prevMessageList)
            : messageList;

        if (token) localStorage.setItem(token, JSON.stringify(newMessageList));

        return {
          messageList: newMessageList,
        };
      }),
  }),
  Object.is,
);
