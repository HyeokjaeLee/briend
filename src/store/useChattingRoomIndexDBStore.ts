import { createWithEqualityFn } from 'zustand/traditional';

import { Message, ChattingRoom } from '@/types';

import type { Channel } from 'pusher-js';

const CHATTING_ROOM_STORE_NAME = 'chatting-room';

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
  createWithEqualityFn<ChattingRoomIndexDBStore>((set) => {
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

        request.onsuccess = (e) => {
          db = (e.target as IDBOpenDBRequest).result;

          if (db.objectStoreNames.contains(CHATTING_ROOM_STORE_NAME)) {
            const chattingRoomStore = db
              .transaction(CHATTING_ROOM_STORE_NAME, 'readonly')
              .objectStore(CHATTING_ROOM_STORE_NAME);

            chattingRoomStore.getAll().onsuccess = (e) => {
              const { result } = e.target as IDBRequest<ChattingRoom[]>;

              set({ chattingRoomList: result });
            };
          }
        };

        request.onupgradeneeded = (e) => {
          db = (e.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains(CHATTING_ROOM_STORE_NAME)) {
            db.createObjectStore(CHATTING_ROOM_STORE_NAME, {
              keyPath: 'token',
            });
          }
        };
      },

      setChattingRoom: (params) => {
        if (!params || !db)
          throw new Error('params 혹은 db가 존재하지 않습니다.');

        const { token, channel } = params;

        const transaction = db.transaction(
          [CHATTING_ROOM_STORE_NAME, token],
          'readonly',
        );

        transaction.objectStore(CHATTING_ROOM_STORE_NAME).get(token).onsuccess =
          (e) => {
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
    };
  }, Object.is);
