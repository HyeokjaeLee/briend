import { ChattingRoom, LastMessage, Message } from '@/types';
import type { Unpacked } from '@/types/util';

const CHATTING_ROOM_STORE_NAME = 'chatting-room';
const LAST_MESSAGE_STORE_NAME = 'last-message';

interface MessageData {
  messageList: Message[];
  lastMessageList: LastMessage[];
}

export const createChattingRoomDB = async (DBName: string) => {
  let db = await new Promise<IDBDatabase>((resolve) => {
    const request = indexedDB.open(DBName);

    const REQUIRE_STORE_NAMES = [
      CHATTING_ROOM_STORE_NAME,
      LAST_MESSAGE_STORE_NAME,
    ];

    request.onsuccess = (e) => {
      const { result: db } = e.target as IDBOpenDBRequest;

      const { objectStoreNames } = db;

      if (
        REQUIRE_STORE_NAMES.some(
          (requireStore) => !objectStoreNames.contains(requireStore),
        )
      )
        return indexedDB.open(DBName, db.version + 1);

      return resolve(db);
    };

    request.onupgradeneeded = (e) => {
      const { result: db } = e.target as IDBOpenDBRequest;

      const { objectStoreNames } = db;

      REQUIRE_STORE_NAMES.forEach((requireStore) => {
        if (!objectStoreNames.contains(requireStore)) {
          db.createObjectStore(requireStore, {
            keyPath: 'token',
          });
        }
      });
    };
  });

  const getStores = (
    storeNames: string[],
    mode?: IDBTransactionMode | undefined,
  ) => {
    try {
      const transaction = db.transaction(storeNames, mode);
      return storeNames.map((storeName) => transaction.objectStore(storeName));
    } catch {
      throw new Error(`storeNames: ${storeNames}가 존재하지 않습니다.`);
    }
  };

  const upgradeDB = () => {
    db.close();
    return indexedDB.open(DBName, db.version + 1);
  };

  return {
    getChattingRoomList: () =>
      new Promise<ChattingRoom[]>((resolve) => {
        const [chattingRoomStore] = getStores([CHATTING_ROOM_STORE_NAME]);

        chattingRoomStore.getAll().onsuccess = (e) =>
          resolve((e.target as IDBRequest).result);
      }),

    addChattingRoom: (chattingRoom: ChattingRoom) =>
      new Promise<ChattingRoom[]>((resolve) => {
        const [chattingRoomStore] = getStores(
          [CHATTING_ROOM_STORE_NAME],
          'readwrite',
        );

        chattingRoomStore.add(chattingRoom).onsuccess = () => {
          chattingRoomStore.getAll().onsuccess = (e) =>
            resolve((e.target as IDBRequest).result);
        };
      }),

    deleteChattingRoom: (token: string) =>
      new Promise<ChattingRoom[]>((resolve) => {
        const [chattingRoomStore] = getStores(
          [CHATTING_ROOM_STORE_NAME],
          'readwrite',
        );

        chattingRoomStore.delete(token).onsuccess = () => {
          chattingRoomStore.getAll().onsuccess = (e) =>
            resolve((e.target as IDBRequest).result);
        };
      }),

    createMessageStore: (token: string) => {
      const request = upgradeDB();

      request.onupgradeneeded = (e) => {
        db = (e.target as IDBOpenDBRequest).result;

        db.createObjectStore(token, {
          keyPath: 'id',
          autoIncrement: true,
        });
      };

      return new Promise<MessageData>((resolve) => {
        request.onsuccess = (e) => {
          db = (e.target as IDBOpenDBRequest).result;

          const [messageStore, lastMessageStore] = getStores(
            [token, LAST_MESSAGE_STORE_NAME],
            'readwrite',
          );

          messageStore.getAll().onsuccess = (e) => {
            const { result: messageList } = e.target as IDBRequest<Message[]>;

            lastMessageStore.add({
              token,
            }).onsuccess = () => {
              lastMessageStore.getAll().onsuccess = (e) =>
                resolve({
                  messageList,
                  lastMessageList: (e.target as IDBRequest<LastMessage[]>)
                    .result,
                });
            };
          };
        };
      });
    },

    deleteMessageStore: (token: string) => {
      const request = upgradeDB();

      request.onupgradeneeded = (e) => {
        db = (e.target as IDBOpenDBRequest).result;

        db.deleteObjectStore(token);
      };

      return new Promise<LastMessage[]>((resolve) => {
        request.onsuccess = (e) => {
          db = (e.target as IDBOpenDBRequest).result;

          const [lastMessageStore] = getStores(
            [LAST_MESSAGE_STORE_NAME],
            'readwrite',
          );

          lastMessageStore.delete(token).onsuccess = () => {
            lastMessageStore.getAll().onsuccess = (e) =>
              resolve((e.target as IDBRequest).result);
          };
        };
      });
    },

    getMessageList: (token: string) =>
      new Promise<Message[]>((resolve) => {
        const [messageStore] = getStores([token]);

        messageStore.getAll().onsuccess = (e) =>
          resolve((e.target as IDBRequest).result);
      }),

    getLastMessageList: () =>
      new Promise<LastMessage[]>((resolve) => {
        const [lastMessageList] = getStores([LAST_MESSAGE_STORE_NAME]);

        lastMessageList.getAll().onsuccess = (e) =>
          resolve((e.target as IDBRequest).result);
      }),

    addMessage: (token: string, message: Message) =>
      new Promise<MessageData>((resolve) => {
        const [messageStore, lastMessageStore] = getStores(
          [token, LAST_MESSAGE_STORE_NAME],
          'readwrite',
        );

        messageStore.add(message).onsuccess = () => {
          messageStore.getAll().onsuccess = (e) => {
            const { result: messageList } = e.target as IDBRequest<Message[]>;

            lastMessageStore.put({
              token,
              message,
            } satisfies LastMessage).onsuccess = () => {
              lastMessageStore.getAll().onsuccess = (e) =>
                resolve({
                  messageList,
                  lastMessageList: (e.target as IDBRequest).result,
                });
            };
          };
        };
      }),
  };
};

export type ChattingRoomDB = Unpacked<ReturnType<typeof createChattingRoomDB>>;
