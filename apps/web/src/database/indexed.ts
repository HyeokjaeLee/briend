import { Dexie, type EntityTable } from 'dexie';

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

class ChattingDatabase extends Dexie {
  messages!: EntityTable<Message, 'id'>;

  constructor() {
    super('ChattingDB');
    this.version(1).stores({
      messages: 'id, userId, timestamp',
    });
  }
}

export const chattingDB = new ChattingDatabase();
