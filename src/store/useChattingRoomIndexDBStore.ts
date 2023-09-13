import { createWithEqualityFn } from 'zustand/traditional';

import { LOCAL_STORAGE } from '@/constants';
import { Message, ChattingRoom } from '@/types';

import type { Channel } from 'pusher-js';

const CHATTING_ROOM_STORE_NAME = 'chatting-room';

enum UPGRADE_TYPE {
  CREATE = 'create',
  DELETE = 'delete',
}

interface ChattingRoomIndexDBStore {
  mountDB: (userId?: string | null) => void;
  chattingRoomList?: ChattingRoom[];

  chattingRoom?:
    | (ChattingRoom & {
        channel: Channel;
      })
    | null;
  messageList?: Message[];
  setChattingRoom: (params: { token: string; channel: Channel } | null) => void;

  createChattingRoom: (chattingRoom: ChattingRoom) => void;
  deleteChattingRoom: (token: string) => void;
}

export const useChattingRoomIndexDBStore =
  createWithEqualityFn<ChattingRoomIndexDBStore>((set, get) => {
    let DBName: string | undefined;
    let DBVersion: number;
    const increaseDBVersion = () => {
      DBVersion += 1;
      window.localStorage.setItem(
        LOCAL_STORAGE.INDEXED_DB_VERSION,
        String(DBVersion),
      );
      return DBVersion;
    };

    let upgradeNeededArgs: {
      type: UPGRADE_TYPE;
      token: string;
    } | null = null;

    const getMessageStoreName = (token: string) => `message-${token}`;

    let request: IDBOpenDBRequest | undefined;

    let db: IDBDatabase | undefined;

    const checkChattingRoomStoreExist = (db: IDBDatabase) =>
      db.objectStoreNames.contains(CHATTING_ROOM_STORE_NAME);

    const checkMessageStoreExist = (
      db: IDBDatabase,
      messageStoreName: string,
    ) => db.objectStoreNames.contains(messageStoreName);

    return {
      mountDB: (userId) => {
        DBVersion = Number(
          window.localStorage.getItem(LOCAL_STORAGE.INDEXED_DB_VERSION) ?? 1,
        );

        DBName = `${userId ?? 'guest'}-db`;

        request = indexedDB.open(DBName, DBVersion);

        request.onsuccess = (e) => {
          db = (e.target as IDBOpenDBRequest).result;
          if (checkChattingRoomStoreExist(db)) {
            const chattingRoomStore = db
              .transaction(CHATTING_ROOM_STORE_NAME, 'readonly')
              .objectStore(CHATTING_ROOM_STORE_NAME);

            chattingRoomStore.getAll().onsuccess = (e) => {
              const { result } = e.target as IDBRequest<ChattingRoom[]>;

              set({ chattingRoomList: result });
            };
          } else if (DBName)
            request = indexedDB.open(DBName, increaseDBVersion());
        };

        request.onupgradeneeded = (e) => {
          const { result: db } = e.target as IDBOpenDBRequest;

          if (!checkChattingRoomStoreExist(db)) {
            db.createObjectStore(CHATTING_ROOM_STORE_NAME, {
              keyPath: 'token',
            });
          }

          //* messageStore 생성 및 삭제
          if (upgradeNeededArgs) {
            const { type, token } = upgradeNeededArgs;

            const messageStoreName = getMessageStoreName(token);

            const isMessageStoreExist = checkMessageStoreExist(
              db,
              messageStoreName,
            );

            switch (type) {
              case UPGRADE_TYPE.CREATE: {
                if (!isMessageStoreExist) {
                  // TODO: 여기 못들어오고 있음
                  console.log('test');
                  db.createObjectStore(messageStoreName, {
                    keyPath: 'id',
                    autoIncrement: true,
                  });
                }

                break;
              }

              case UPGRADE_TYPE.DELETE: {
                if (isMessageStoreExist) db.deleteObjectStore(messageStoreName);

                break;
              }
            }

            upgradeNeededArgs = null;
          }
        };
      },

      setChattingRoom: (params) => {
        if (!params || !db)
          throw new Error('params 혹은 db가 존재하지 않습니다.');

        const { token, channel } = params;
        const messageStoreName = getMessageStoreName(token);

        if (
          checkMessageStoreExist(db, messageStoreName) &&
          checkChattingRoomStoreExist(db)
        ) {
          const transaction = db.transaction(
            [CHATTING_ROOM_STORE_NAME, messageStoreName],
            'readonly',
          );

          transaction
            .objectStore(CHATTING_ROOM_STORE_NAME)
            .get(token).onsuccess = (e) => {
            const { result } = e.target as IDBRequest<ChattingRoom>;

            set({
              chattingRoom: {
                ...result,
                channel,
              },
            });
          };

          transaction.objectStore(messageStoreName).getAll().onsuccess = (
            e,
          ) => {
            const { result } = e.target as IDBRequest<Message[]>;

            set({ messageList: result });
          };
        }
      },

      createChattingRoom: (chattingRoom) => {
        if (!request || !db || !DBName) {
          throw new Error(
            'chattingRoom을 생성하기 위한 요소가 존재하지 않습니다.',
          );
        }

        const { token } = chattingRoom;

        if (!checkMessageStoreExist(db, getMessageStoreName(token))) {
          upgradeNeededArgs = {
            type: UPGRADE_TYPE.CREATE,
            token,
          };

          request = indexedDB.open(DBName, increaseDBVersion());
        }

        db.transaction(CHATTING_ROOM_STORE_NAME, 'readwrite')
          .objectStore(CHATTING_ROOM_STORE_NAME)
          .add(chattingRoom);
      },

      deleteChattingRoom: (token) => {
        if (!request || !db || !DBName) {
          throw new Error(
            'chattingRoom을 삭제하기 위한 요소가 존재하지 않습니다.',
          );
        }

        db.transaction(CHATTING_ROOM_STORE_NAME, 'readwrite')
          .objectStore(CHATTING_ROOM_STORE_NAME)
          .delete(token);

        if (!checkMessageStoreExist(db, getMessageStoreName(token))) {
          upgradeNeededArgs = {
            type: UPGRADE_TYPE.DELETE,
            token,
          };

          request = indexedDB.open(DBName, increaseDBVersion());
        }
      },
    };
  }, Object.is);
