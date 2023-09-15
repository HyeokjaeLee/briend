import { createWithEqualityFn } from 'zustand/traditional';

type SendingMessageMap = Map<Date, string>;

interface TempMessageStore {
  sendingMessageMap: SendingMessageMap;
  setSendingMessageMap: (
    sendingMessageMap:
      | SendingMessageMap
      | ((prevMap: SendingMessageMap) => SendingMessageMap),
  ) => void;
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
  }),
  Object.is,
);
