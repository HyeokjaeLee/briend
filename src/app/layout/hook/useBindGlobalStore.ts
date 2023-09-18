import Pusher from 'pusher-js';
import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { LANGUAGE } from '@/constants';
import { useGlobalStore } from '@/store/useGlobalStore';
import { isServerSide } from '@/utils';

export const useBindGlobalStore = () => {
  const [setPusher, setDeviceLanguage] = useGlobalStore(
    (state) => [state.setPusher, state.setDeviceLanguage],
    shallow,
  );

  useEffect(() => {
    if (isServerSide()) return;
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;

    if (pusherKey) {
      const pusher = new Pusher(pusherKey, {
        cluster: 'ap3',
      });

      setPusher(pusher);
    }

    const { language } = navigator;

    switch (language) {
      case 'ko-KR':
        return setDeviceLanguage(LANGUAGE.KOREAN);
      case 'ja-JP':
        return setDeviceLanguage(LANGUAGE.JAPANESE);
      default:
        return setDeviceLanguage(LANGUAGE.ENGLISH);
    }
  }, [setPusher, setDeviceLanguage]);
};
