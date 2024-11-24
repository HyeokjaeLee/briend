'use client';

import { Dexie, type EntityTable } from 'dexie';

interface Friend {
  userId: string;
  emoji: string;
  isGuest: boolean;
}

(async () => {
  if (typeof window !== 'undefined') {
    await import('dexie-observable');
  }
})();

const db = new Dexie('friendDB') as Dexie & {
  friend: EntityTable<Friend, 'userId'>;
};

db.version(1).stores({
  friend: 'userId, emoji',
});

export const friendTable = db.friend;
