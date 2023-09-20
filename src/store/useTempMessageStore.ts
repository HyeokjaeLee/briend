import { createWithEqualityFn } from 'zustand/traditional';

type SendingMessageMap = Map<number, string>;

interface TempMessageStore {
  sendingMessageMap: SendingMessageMap;
  setSendingMessageMap: (
    sendingMessageMap:
      | SendingMessageMap
      | ((prevMap: SendingMessageMap) => SendingMessageMap),
  ) => void;

  messageText: string;
  setMessageText: (messageText: string) => void;
}

export const useTempMessageStore = createWithEqualityFn<TempMessageStore>(
  (set) => ({
    sendingMessageMap: new Map(),
    setSendingMessageMap: (sendingMessageMap) =>
      set((state) => ({
        sendingMessageMap:
          typeof sendingMessageMap === 'function'
            ? sendingMessageMap(state.sendingMessageMap)
            : sendingMessageMap,
      })),

    messageText: '',
    setMessageText: (messageText) =>
      set({
        messageText,
      }),
  }),
  Object.is,
);
