import { ChattingRoom, Message } from '@/types';
import type { Unpacked } from '@/types';

enum STORE {
  CHATTING_ROOM = 'chatting-room',
  MESSAGE_DATA = 'message-data',
  LAST_MESSAGE = 'last-message',
}

const REQUIRE_STORES = [
  STORE.CHATTING_ROOM,
  STORE.MESSAGE_DATA,
  STORE.LAST_MESSAGE,
];

interface MessageData {
  token: string;
  messageList: Message[];
}

export interface LastMessage {
  token: string;
  message?: Message;
}

export const createChattingDataDB = async (DBName: string) => {
  const db = await new Promise<IDBDatabase>((resolve) => {
    const request = indexedDB.open(DBName);

    const handleUpgrade = (e: IDBVersionChangeEvent) => {
      const { result: db } = e.target as IDBOpenDBRequest;

      const { objectStoreNames } = db;

      REQUIRE_STORES.forEach((requireStore) => {
        if (!objectStoreNames.contains(requireStore)) {
          db.createObjectStore(requireStore, {
            keyPath: 'token',
          });
        }
      });
    };

    request.onsuccess = (e) => {
      const { result: db } = e.target as IDBOpenDBRequest;

      const { objectStoreNames } = db;

      if (
        REQUIRE_STORES.some(
          (requireStore) => !objectStoreNames.contains(requireStore),
        )
      ) {
        db.close();
        indexedDB.open(DBName, db.version + 1).onupgradeneeded = handleUpgrade;

        return;
      }

      return resolve(db);
    };

    request.onupgradeneeded = handleUpgrade;
  });

  const getStores = (
    storeNames: string[],
    mode?: IDBTransactionMode | undefined,
  ) => {
    try {
      const transaction = db.transaction(storeNames, mode);
      return {
        transaction,
        stores: storeNames.map((storeName) =>
          transaction.objectStore(storeName),
        ),
      };
    } catch {
      throw new Error(`storeNames: ${storeNames}가 존재하지 않습니다.`);
    }
  };

  return {
    createChattingData: (chattingRoom: ChattingRoom) => {
      const {
        transaction,
        stores: [chattingRoomStore, messageDataStore, lastMessageStore],
      } = getStores(REQUIRE_STORES, 'readwrite');

      return new Promise<{
        chattingRoom: ChattingRoom;
        messageData: MessageData;
        lastMessage: LastMessage;
      }>((resolve) => {
        chattingRoomStore.add(chattingRoom);

        const { token } = chattingRoom;

        const messageData: MessageData = {
          token,
          messageList: [],
        };

        messageDataStore.add(messageData);

        const lastMessage: LastMessage = {
          token,
        };

        lastMessageStore.add(lastMessage);

        transaction.oncomplete = () =>
          resolve({
            chattingRoom,
            messageData,
            lastMessage,
          });
      });
    },
    getAllChattingRoomAndLastMessage: () => {
      const {
        transaction,
        stores: [chattingRoomStore, lastMessageStore],
      } = getStores([STORE.CHATTING_ROOM, STORE.LAST_MESSAGE]);

      return new Promise<{
        chattingRoomList: ChattingRoom[];
        lastMessageList: LastMessage[];
      }>((resolve) => {
        let chattingRoomList: ChattingRoom[];

        chattingRoomStore.getAll().onsuccess = (e) => {
          chattingRoomList = (e.target as IDBRequest).result;
        };

        let lastMessageList: LastMessage[];

        lastMessageStore.getAll().onsuccess = (e) => {
          lastMessageList = (e.target as IDBRequest).result;
        };

        transaction.oncomplete = () => {
          resolve({
            chattingRoomList,
            lastMessageList,
          });
        };
      });
    },

    deleteChattingData: (token: string) => {
      const {
        transaction,
        stores: [chattingRoomStore, messageDataStore, lastMessageStore],
      } = getStores(REQUIRE_STORES, 'readwrite');

      return new Promise<void>((resolve) => {
        chattingRoomStore.delete(token);

        messageDataStore.delete(token);

        lastMessageStore.delete(token);

        transaction.oncomplete = () => resolve();
      });
    },

    getMessageData: (token: string) => {
      const {
        stores: [messageDataStore],
      } = getStores([STORE.MESSAGE_DATA]);

      return new Promise<MessageData>((resolve) => {
        messageDataStore.get(token).onsuccess = (e) =>
          resolve((e.target as IDBRequest).result);
      });
    },

    updateMessageData: (messageData: MessageData) => {
      const {
        transaction,
        stores: [messageDataStore, lastMessageStore],
      } = getStores([STORE.MESSAGE_DATA, STORE.LAST_MESSAGE], 'readwrite');

      return new Promise<{
        messageData: MessageData;
        lastMessage: LastMessage;
      }>((resolve) => {
        messageDataStore.put(messageData);

        const { messageList } = messageData;

        const lastMessage: LastMessage = {
          token: messageData.token,
          message: messageList[messageList.length - 1],
        };

        lastMessageStore.put(lastMessage);

        transaction.oncomplete = () =>
          resolve({
            messageData,
            lastMessage,
          });
      });
    },
  };
};

export type ChattingDataDB = Unpacked<ReturnType<typeof createChattingDataDB>>;
