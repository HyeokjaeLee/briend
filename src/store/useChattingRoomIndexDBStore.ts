import { difference } from 'lodash-es';
import { createWithEqualityFn } from 'zustand/traditional';

import { Message, ChattingRoom, LastMessage } from '@/types';

import type { Channel } from 'pusher-js';

const CHATTING_ROOM_STORE_NAME = 'chatting-room';
const LAST_MESSAGE_STORE_NAME = 'last-message';

interface ChattingRoomIndexDBStore {
  mountDB: (userId?: string | null) => void;

  lastMessageList?: LastMessage[];

  chattingRoomList?: ChattingRoom[];
  createChattingRoom: (chattingRoom: ChattingRoom) => void;
  deleteChattingRoom: (token: string) => void;

  chattingRoom?:
    | (ChattingRoom & {
        channel: Channel;
      })
    | null;
  setChattingRoom: (params: { token: string; channel: Channel } | null) => void;

  messageList?: Message[] | null;
  createMessage: (message: Message) => void;
}

export const useChattingRoomIndexDBStore =
  createWithEqualityFn<ChattingRoomIndexDBStore>((set, get) => {
    let DBName: string | undefined;

    let request: IDBOpenDBRequest | undefined;

    let db: IDBDatabase | undefined;

    const getChattingRoomStore = () => {
      if (!db) throw new Error('db가 존재하지 않습니다.');
      return db
        .transaction(CHATTING_ROOM_STORE_NAME, 'readwrite')
        .objectStore(CHATTING_ROOM_STORE_NAME);
    };

    const update = (onUpdate: (db: IDBDatabase) => () => void) => {
      if (!db || !DBName)
        throw new Error('db 혹은 DBName이 존재하지 않습니다.');

      db.close();

      request = indexedDB.open(DBName, db.version + 1);

      let handleSuccess: () => void;

      request.onupgradeneeded = (e) => {
        db = (e.target as IDBOpenDBRequest).result;

        handleSuccess = onUpdate(db);
      };

      request.onsuccess = () => handleSuccess();
    };

    return {
      mountDB: (userId) => {
        DBName = `${userId ?? 'guest'}-db`;

        request = indexedDB.open(DBName);

        const handleUpgradeNeeded = (e: IDBVersionChangeEvent) => {
          db = (e.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains(CHATTING_ROOM_STORE_NAME)) {
            db.createObjectStore(CHATTING_ROOM_STORE_NAME, {
              keyPath: 'token',
            });
          }

          if (!db.objectStoreNames.contains(LAST_MESSAGE_STORE_NAME)) {
            db.createObjectStore(LAST_MESSAGE_STORE_NAME, {
              keyPath: 'token',
            });
          }
        };

        const handleSuccess = (e: Event) => {
          db = (e.target as IDBOpenDBRequest).result;

          const isAreadyStoreExist = !difference(
            [CHATTING_ROOM_STORE_NAME, LAST_MESSAGE_STORE_NAME],
            db.objectStoreNames,
          ).length;

          if (isAreadyStoreExist) {
            const transaction = db.transaction(
              [CHATTING_ROOM_STORE_NAME, LAST_MESSAGE_STORE_NAME],
              'readonly',
            );

            transaction
              .objectStore(CHATTING_ROOM_STORE_NAME)
              .getAll().onsuccess = (e) => {
              const { result } = e.target as IDBRequest<ChattingRoom[]>;

              set({ chattingRoomList: result });
            };

            transaction
              .objectStore(LAST_MESSAGE_STORE_NAME)
              .getAll().onsuccess = (e) => {
              const { result } = e.target as IDBRequest<LastMessage[]>;

              set({ lastMessageList: result });
            };
          }
          return { db, isAreadyStoreExist };
        };

        request.onsuccess = (e) => {
          const { db, isAreadyStoreExist } = handleSuccess(e);
          if (!isAreadyStoreExist && DBName) {
            db.close();
            request = indexedDB.open(DBName, db.version + 1);
            request.onsuccess = handleSuccess;
            request.onupgradeneeded = handleUpgradeNeeded;
          }
        };

        request.onupgradeneeded = handleUpgradeNeeded;
      },

      createChattingRoom: (chattingRoom) => {
        const chattingRoomStore = getChattingRoomStore();

        chattingRoomStore.add(chattingRoom).onsuccess = () => {
          chattingRoomStore.getAll().onsuccess = (e) => {
            const { result } = e.target as IDBRequest<ChattingRoom[]>;

            update((db) => {
              db.createObjectStore(chattingRoom.token, {
                keyPath: 'id',
                autoIncrement: true,
              });

              return () => set({ chattingRoomList: result });
            });
          };
        };
      },

      deleteChattingRoom: (token) => {
        const chattingRoomStore = getChattingRoomStore();

        chattingRoomStore.delete(token).onsuccess = () => {
          chattingRoomStore.getAll().onsuccess = (e) => {
            const { result } = e.target as IDBRequest<ChattingRoom[]>;

            update((db) => {
              db.deleteObjectStore(token);

              return () => set({ chattingRoomList: result });
            });
          };
        };
      },

      setChattingRoom: (params) => {
        if (!params) {
          return set({
            chattingRoom: null,
            messageList: null,
          });
        }

        if (!db) throw new Error('db가 존재하지 않습니다.');

        const { token, channel } = params;

        try {
          const transaction = db.transaction(
            [CHATTING_ROOM_STORE_NAME, token],
            'readonly',
          );

          transaction
            .objectStore(CHATTING_ROOM_STORE_NAME)
            .get(token).onsuccess = (e) => {
            const { result: chattingRoom } =
              e.target as IDBRequest<ChattingRoom>;

            set({
              chattingRoom: {
                ...chattingRoom,
                channel,
              },
            });
          };

          transaction.objectStore(token).getAll().onsuccess = (e) => {
            const { result: messageList } = e.target as IDBRequest<Message[]>;

            set({ messageList });
          };
        } catch {
          const { deleteChattingRoom } = get();

          deleteChattingRoom(token);
          window.location.reload();
        }
      },

      createMessage: (message) => {
        if (!db) throw new Error('db가 존재하지 않습니다.');
        const { chattingRoom } = get();

        if (!chattingRoom) throw new Error('chattingRoom이 존재하지 않습니다.');

        const { token } = chattingRoom;

        const transaction = db.transaction(
          [token, LAST_MESSAGE_STORE_NAME],
          'readwrite',
        );

        const messageStore = transaction.objectStore(token);

        messageStore.add(message).onsuccess = () => {
          messageStore.getAll().onsuccess = (e) => {
            const { result: messageList } = e.target as IDBRequest<Message[]>;

            const lastMessageStore = transaction.objectStore(
              LAST_MESSAGE_STORE_NAME,
            );

            lastMessageStore.put({
              token,
              message: message.message[chattingRoom.opponentLanguage],
            } satisfies LastMessage).onsuccess = () => {
              lastMessageStore.getAll().onsuccess = (e) => {
                const { result: lastMessageList } = e.target as IDBRequest<
                  LastMessage[]
                >;

                set({ messageList, lastMessageList });
              };
            };
          };
        };
      },
    };
  }, Object.is);
