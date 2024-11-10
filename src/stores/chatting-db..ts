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

interface ChattingMessage
  extends PusherType.receiveMessage,
    PusherType.sendMessage {
  index: number;
  timestamp: number;
}

const db = new Dexie('chattingDB', {
  addons: [relationships],
}) as Dexie & {
  chattingRoom: EntityTable<ChattingRoom, 'id'>;
  chattingMessage: EntityTable<ChattingMessage, 'index'>;
};

db.version(1).stores({
  chattingRoom: 'id, token',
  chattingMessage:
    '++index, chattingRoomId -> chattingRoom.id, timestamp, id, userId, message, translatedMessage',
});

export const chattingRoomTable = db.chattingRoom;
export const chattingMessageTable = db.chattingMessage;
