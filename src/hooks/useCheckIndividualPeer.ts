import { useShallow } from 'zustand/shallow';

import { useEffect, useState } from 'react';

import { usePeerStore } from '@/stores';

export const useCheckIndividualPeer = (userId: string) => {
  const [isMounted, friendPeer, setFriendConnections] = usePeerStore(
    useShallow(({ isMounted, friendConnections, setFriendConnections }) => [
      isMounted,
      friendConnections.data.get(userId),
      setFriendConnections,
    ]),
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {}, []);
};
