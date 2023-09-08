import Pusher from 'pusher-js';

import { useEffect } from 'react';

import { useGlobalStore } from '@/store/useGlobalStore';
import { isServerSide } from '@/utils';

export const useBindGlobalStore = () => {
  const setPusher = useGlobalStore((state) => state.setPusher);

  useEffect(() => {
    if (isServerSide()) return;
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    if (pusherKey) {
      const pusher = new Pusher(pusherKey, {
        cluster: 'ap3',
      });

      setPusher(pusher);
    }
  }, [setPusher]);
};
