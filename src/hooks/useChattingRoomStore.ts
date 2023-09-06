import PusherJs from 'pusher-js';
import { createWithEqualityFn } from 'zustand/traditional';

import { LOCAL_STORAGE } from '@/constants';
import type { Message } from '@/types';
import { chattingChannelName, decodeChattingRoomToken } from '@/utils';
import { DecodedChattingRoomToken } from '@api/chatting-room/join';

import type { Channel } from 'pusher-js';

export interface ChattingRoom
  extends Omit<DecodedChattingRoomToken, 'exp' | 'iat'> {
  startAt: Date;
  endAt: Date;
}

interface ChattingRoomStore {
  channel?: Channel | null;
  token?: string | null;

  chattingRoom?: ChattingRoom | null;
  setChattingRoom: (token: string) => void;

  messageList: Message[];
  addMessage: (message: Message) => void;

  chattingRoomMap: Map<string, ChattingRoom>;
  setChattingRoomMap: (chattingRoomMap: Map<string, ChattingRoom>) => void;
}

export const useChattingRoomStore = createWithEqualityFn<ChattingRoomStore>(
  (set, get) => ({
    setChattingRoom: (token) => {
      const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
      const chattingRoom = decodeChattingRoomToken(token);

      if (pusherKey && chattingRoom) {
        const pusher = new PusherJs(pusherKey, {
          cluster: 'ap3',
        });

        const { hostId, guestName } = chattingRoom;

        const channelName = chattingChannelName({
          hostId,
          guestName,
        });

        return set({
          channel: pusher.subscribe(channelName),
          token,
          chattingRoom,
          messageList: JSON.parse(localStorage.getItem(token) ?? '[]'),
        });
      }
    },

    messageList: [],
    addMessage: (message) => {
      const { token } = get();

      if (token) {
        return set((state) => {
          const messageList = [...state.messageList, message];

          localStorage.setItem(token, JSON.stringify(messageList));

          return {
            messageList,
          };
        });
      }
    },

    chattingRoomMap: new Map(),
    setChattingRoomMap: (chattingRoomMap) => {
      const chattingRoomTokenList = [...chattingRoomMap.keys()];

      localStorage.setItem(
        LOCAL_STORAGE.CHATTING_ROOM_TOKEN_LIST,
        JSON.stringify(chattingRoomTokenList),
      );

      return set({
        chattingRoomMap,
      });
    },
  }),
  Object.is,
);
