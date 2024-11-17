'use client';

import { Dexie, type EntityTable } from 'dexie';
import relationships from 'dexie-relationships';

import type { PusherType } from '@/types/api';

(async () => {
  if (typeof window !== 'undefined') {
    await import('dexie-observable');
  }
})();

interface ChattingRoom {
  id: string;
  token: string;
}

export interface ChattingMessage extends PusherType.sendMessage {
  chattingRoomId: string;
  state: 'sent' | 'receive' | 'error';
}

const db = new Dexie('chattingDB', {
  addons: [relationships],
}) as Dexie & {
  chattingRoom: EntityTable<ChattingRoom, 'id'>;
  chattingMessage: EntityTable<ChattingMessage, 'id'>;
};

db.version(1).stores({
  chattingRoom: 'id, token',
  chattingMessage:
    '&id, fromUserId, message, translatedMessage, chattingRoomId -> chattingRoom.id, timestamp, isReceived',
});

export const chattingRoomTable = db.chattingRoom;
export const chattingMessageTable = db.chattingMessage;
