'use client';

import { Dexie, type EntityTable } from 'dexie';
import relationships from 'dexie-relationships';

import { IS_CLIENT } from '@/constants/etc';
import type { PusherMessage } from '@/types/pusher-message';

(async () => {
  if (IS_CLIENT) {
    await import('dexie-observable');
  }
})();

interface ChattingRoom {
  id: string;
  token: string;
}

export interface ChattingMessage extends PusherMessage.sendMessage {
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
