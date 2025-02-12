import { useEffect } from 'react';

import { firestore } from '@/database/firestore/client';

export const GlobalFireStoreSubscription = () => {
  useEffect(() => {
    firestore(({ collection }) => {});
  }, []);

  const test = {
    users: [
      {
        uid: 'user1',
        user2: [
          {
            message: 'hello',
            translatedMessage: '안녕',
          },
          {
            message: 'hello',
            translatedMessage: '안녕',
          },
        ],
        user3: [],
      },
      {
        uid: 'user2',
        user1: [
          {
            message: 'hello',
            translatedMessage: '안녕',
          },
          {
            message: 'hello',
            translatedMessage: '안녕',
          },
        ],
      },
    ],
  };

  return null;
};
