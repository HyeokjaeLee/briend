'use client';

import { Dexie, type EntityTable } from 'dexie';
import relationships from 'dexie-relationships';

import { IS_CLIENT } from '@/constants/etc';
import type { PusherMessage } from '@/types/pusher-message';

enum MESSAGE_STATE {
  SENT = 'sent',
  RECEIVE = 'receive',
  ERROR = 'error',
}

interface IndexedDB extends Dexie {
  friend: EntityTable<PusherMessage.addFriend, 'userId'>;
  message: EntityTable<
    PusherMessage.sendMessage & { state: MESSAGE_STATE },
    'id'
  >;
}

let db: IndexedDB | undefined;

if (IS_CLIENT) {
  import('dexie-observable');

  db = new Dexie('briendDB', {
    addons: [relationships],
  }) as IndexedDB;

  db.version(1).stores({
    friend: 'userId, friendToken',
    message:
      'id, fromUserId -> friend.userId, message, translatedMessage, timestamp, state',
  });
}

export const friendTable = db?.friend;
export const messageTable = db?.message;
