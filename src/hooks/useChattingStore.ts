import jwt from 'jsonwebtoken';
import PusherJs from 'pusher-js';
import { createWithEqualityFn } from 'zustand/traditional';

import type { DecodedChattingRoomToken } from '@/app/api/chatting-room/join/route';
import type { Message } from '@/types';

const CHATTING_ROOM_TOKEN_LIST = 'chatting-room-token-list';

interface ChattingStore extends Partial<DecodedChattingRoomToken> {
  bindChattingStoreFromLocalStorage: () => void;
  pusher?: PusherJs;
  isBinded: boolean;
  chattingRoomTokenList?: string[];
  addChattingRoomToken: (chattingRoomToken: string) => void;
  replaceChattingRoomToken: (chattingRoomToken: {
    old: string;
    new: string;
  }) => void;
  removeChattingRoomToken: (chattingRoomToken: string) => void;

  setChattingRoom: (chattingRoomToken: string) => void;
  chattingRoomToken?: string;
  messageList?: Message[];
  addMessage?: (message: Message) => void;
}

const setTokenListToLocalStorage = (tokenList: string[]) =>
  localStorage.setItem(CHATTING_ROOM_TOKEN_LIST, JSON.stringify(tokenList));

export const useChattingStore = createWithEqualityFn<ChattingStore>(
  (set) => ({
    isBinded: false,

    bindChattingStoreFromLocalStorage: () => {
      const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;

      if (!pusherKey) throw new Error('pusherKey가 없습니다.');

      return set({
        pusher: new PusherJs(pusherKey, {
          cluster: 'ap3',
        }),
        isBinded: true,
        chattingRoomTokenList: JSON.parse(
          localStorage.getItem(CHATTING_ROOM_TOKEN_LIST) ?? '[]',
        ),
      });
    },

    addChattingRoomToken: (chattingRoomToken) =>
      set((state) => {
        const chattingRoomTokenList = [
          ...(state.chattingRoomTokenList ?? []),
          chattingRoomToken,
        ];

        setTokenListToLocalStorage(chattingRoomTokenList);

        return {
          chattingRoomTokenList,
        };
      }),

    replaceChattingRoomToken: (chattingRoomToken) =>
      set((state) => {
        const chattingRoomTokenList =
          state.chattingRoomTokenList?.filter(
            (token) => chattingRoomToken.old !== token,
          ) ?? [];

        chattingRoomTokenList.push(chattingRoomToken.new);

        setTokenListToLocalStorage(chattingRoomTokenList);

        const oldMessageList = localStorage.getItem(chattingRoomToken.old);

        if (oldMessageList) {
          localStorage.setItem(chattingRoomToken.new, oldMessageList);
          localStorage.removeItem(chattingRoomToken.old);
        }

        return {
          chattingRoomTokenList,
        };
      }),

    removeChattingRoomToken: (chattingRoomToken) =>
      set((state) => {
        const chattingRoomTokenList =
          state.chattingRoomTokenList?.filter(
            (token) => token !== chattingRoomToken,
          ) ?? [];

        setTokenListToLocalStorage(chattingRoomTokenList);

        localStorage.removeItem(chattingRoomToken);

        return {
          chattingRoomTokenList,
        };
      }),

    setChattingRoom: (chattingRoomToken) =>
      set((state) => {
        const chattingRoomTokenList =
          state.chattingRoomTokenList?.filter(
            (token) => token !== chattingRoomToken,
          ) ?? [];

        chattingRoomTokenList.push(chattingRoomToken);

        setTokenListToLocalStorage(chattingRoomTokenList);

        const decoded = jwt.decode(
          chattingRoomToken,
        ) as DecodedChattingRoomToken;

        return {
          ...decoded,
          chattingRoomTokenList,
          chattingRoomToken,
          messageList: JSON.parse(
            localStorage.getItem(chattingRoomToken) ?? '[]',
          ),
        };
      }),

    addMessage: (message) =>
      set((state) => {
        const messageList = [...(state.messageList ?? []), message];

        const { chattingRoomToken } = state;

        if (!chattingRoomToken)
          throw new Error('chattingRoomToken이 없습니다.');

        localStorage.setItem(chattingRoomToken, JSON.stringify(messageList));

        return {
          messageList,
        };
      }),
  }),
  Object.is,
);
