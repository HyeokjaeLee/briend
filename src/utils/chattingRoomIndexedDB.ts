import { difference } from 'lodash-es';

import { ChattingRoom, LastMessage, Message } from '@/types';

const CHATTING_ROOM_STORE_NAME = 'chatting-room';
const LAST_MESSAGE_STORE_NAME = 'last-message';

interface MessageData {
  messageList: Message[];
  lastMessageList: LastMessage[];
}

export class ChattingRoomDB {
  constructor(DBName: string) {
    this.DBName = DBName;

    const request = indexedDB.open(DBName);

    request.onsuccess = (e) => {
      this.db = (e.target as IDBOpenDBRequest).result;

      if (
        difference(
          [CHATTING_ROOM_STORE_NAME, LAST_MESSAGE_STORE_NAME],
          this.db.objectStoreNames,
        ).length
      )
        indexedDB.open(DBName, this.db.version + 1);
    };

    request.onupgradeneeded = (e) => {
      this.db = (e.target as IDBOpenDBRequest).result;

      if (!this.db.objectStoreNames.contains(CHATTING_ROOM_STORE_NAME)) {
        this.db.createObjectStore(CHATTING_ROOM_STORE_NAME, {
          keyPath: 'token',
        });
      }

      if (!this.db.objectStoreNames.contains(LAST_MESSAGE_STORE_NAME)) {
        this.db.createObjectStore(LAST_MESSAGE_STORE_NAME, {
          keyPath: 'token',
        });
      }
    };
  }

  private DBName: string;

  private db: IDBDatabase | undefined;

  private getStores = (
    storeNames: string[],
    mode?: IDBTransactionMode | undefined,
  ) => {
    if (!this.db) throw new Error('DB가 초기화되지 않았습니다.');
    const transaction = this.db.transaction(storeNames, mode);
    return storeNames.map((storeName) => transaction.objectStore(storeName));
  };

  getChattingRoomList = () =>
    new Promise<ChattingRoom[]>((resolve) => {
      const [chattingRoomStore] = this.getStores([CHATTING_ROOM_STORE_NAME]);

      chattingRoomStore.getAll().onsuccess = (e) =>
        resolve((e.target as IDBRequest).result);
    });

  addChattingRoom = (chattingRoom: ChattingRoom) =>
    new Promise<ChattingRoom[]>((resolve) => {
      const [chattingRoomStore] = this.getStores(
        [CHATTING_ROOM_STORE_NAME],
        'readwrite',
      );

      chattingRoomStore.add(chattingRoom).onsuccess = () => {
        chattingRoomStore.getAll().onsuccess = (e) =>
          resolve((e.target as IDBRequest).result);
      };
    });

  deleteChattingRoom = (token: string) =>
    new Promise<ChattingRoom[]>((resolve) => {
      const [chattingRoomStore] = this.getStores(
        [CHATTING_ROOM_STORE_NAME],
        'readwrite',
      );

      chattingRoomStore.delete(token).onsuccess = () => {
        chattingRoomStore.getAll().onsuccess = (e) =>
          resolve((e.target as IDBRequest).result);
      };
    });

  createMessageStore = (token: string) => {
    if (!this.db) throw new Error('DB가 초기화되지 않았습니다.');

    const request = indexedDB.open(this.DBName, this.db.version + 1);

    request.onupgradeneeded = (e) => {
      this.db = (e.target as IDBOpenDBRequest).result;

      this.db.createObjectStore(token, {
        keyPath: 'id',
        autoIncrement: true,
      });
    };

    return new Promise<MessageData>((resolve) => {
      request.onsuccess = (e) => {
        this.db = (e.target as IDBOpenDBRequest).result;

        const [messageStore, lastMessageStore] = this.getStores(
          [token, LAST_MESSAGE_STORE_NAME],
          'readwrite',
        );

        messageStore.getAll().onsuccess = (e) => {
          const { result: messageList } = e.target as IDBRequest<Message[]>;
          lastMessageStore.add({
            token,
          }).onsuccess = () => {
            lastMessageStore.getAll().onsuccess = (e) => {
              const { result: lastMessageList } = e.target as IDBRequest<
                LastMessage[]
              >;

              resolve({
                messageList,
                lastMessageList,
              });
            };
          };
        };
      };
    });
  };

  deleteMessageStore = (token: string) => {
    if (!this.db) throw new Error('DB가 초기화되지 않았습니다.');

    const request = indexedDB.open(this.DBName, this.db.version + 1);

    request.onupgradeneeded = (e) => {
      this.db = (e.target as IDBOpenDBRequest).result;

      this.db.deleteObjectStore(token);
    };

    return new Promise<LastMessage[]>((resolve) => {
      request.onsuccess = (e) => {
        this.db = (e.target as IDBOpenDBRequest).result;

        const [lastMessageStore] = this.getStores(
          [LAST_MESSAGE_STORE_NAME],
          'readwrite',
        );

        lastMessageStore.delete(token).onsuccess = () => {
          lastMessageStore.getAll().onsuccess = (e) =>
            resolve((e.target as IDBRequest).result);
        };
      };
    });
  };

  getMessageList = (token: string) =>
    new Promise<Message[]>((resolve) => {
      const [messageStore] = this.getStores([token]);

      messageStore.getAll().onsuccess = (e) =>
        resolve((e.target as IDBRequest).result);
    });

  addMessage = (token: string, message: Message) =>
    new Promise<MessageData>((resolve) => {
      const [messageStore, lastMessageStore] = this.getStores(
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
            lastMessageStore.getAll().onsuccess = (e) => {
              const { result: lastMessageList } = e.target as IDBRequest<
                LastMessage[]
              >;

              resolve({ messageList, lastMessageList });
            };
          };
        };
      };
    });
}
