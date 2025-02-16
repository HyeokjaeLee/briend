import { useState } from 'react';

export const useDeleteMessage = () => {
  const [messageIdsForRemove, setMessageIdsForRemove] = useState<string[]>([]);

  return {
    ids: messageIdsForRemove,
    add: (id: string) => setMessageIdsForRemove((prev) => [...prev, id]),
    remove: (id: string) =>
      setMessageIdsForRemove((prev) => prev.filter((prevId) => prevId !== id)),
    reset: () => setMessageIdsForRemove([]),
  };
};
