import { Dexie, type EntityTable } from 'dexie';
import relationships from 'dexie-relationships';

import { IS_CLIENT } from '@/constants';

export enum MESSAGE_STATE {
  SENT = 'sent',
  RECEIVE = 'receive',
  READ = 'read',
  ERROR = 'error',
}

export interface Message {
  id: string;
  state: MESSAGE_STATE;
  isMine: boolean;
  userId: string;
  message: string;
  translatedMessage: string;
  timestamp: number;
}

interface IndexedDb extends Dexie {
  messages: EntityTable<Message, 'id'>;
}

let db: IndexedDb | undefined;

if (IS_CLIENT) {
  import('dexie-observable');

  db = new Dexie('briendDB', {
    addons: [relationships],
  }) as IndexedDb;

  db.version(1).stores({
    message: 'id, userId, timestamp',
  });
}

/**
 *   async getMessagesByUser(userId: string): Promise<ChatMessage[]> {
    return this.messages
      .where('userId').equals(userId)
      .reverse()
      .sortBy('timestamp');
  }

 */
