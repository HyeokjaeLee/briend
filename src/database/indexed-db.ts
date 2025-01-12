'use client';

import { Dexie, type EntityTable } from 'dexie';
import relationships from 'dexie-relationships';

import { IS_CLIENT } from '@/constants';
import type { MessageData } from '@/types/peer-data';

export enum MESSAGE_STATE {
  SENT = 'sent',
  RECEIVE = 'receive',
  ERROR = 'error',
}

export interface ProfileImageTableItem {
  userId: string;
  blob: Blob;
  type: string;
  updatedAt: number;
}

export interface MessageTableItem extends MessageData {
  id: string;
  state: MESSAGE_STATE;
  toUserId: string;
}

interface IndexedDB extends Dexie {
  friend: EntityTable<{ userId: string; friendToken: string }, 'userId'>;
  message: EntityTable<MessageTableItem, 'id'>;
  profileImage: EntityTable<ProfileImageTableItem, 'userId'>;
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
      'id, fromUserId -> friend.userId, *toUserId, timestamp, message, translatedMessage, state',
    profileImage: 'userId, blob, type, updatedAt',
  });
}

export const friendTable = db?.friend;
export const messageTable = db?.message;
export const profileImageTable = db?.profileImage;
