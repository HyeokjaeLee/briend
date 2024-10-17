import { useEffect } from 'react';

import { LOCAL_STORAGE } from '@/constants/storage-key';
import { useGlobalStore } from '@/stores/global';

export const GlobalStoreSync = () => {
  const setChattingInfo = useGlobalStore((state) => state.setChattingInfo);

  useEffect(() => {
    const chattingInfo = localStorage.getItem(
      LOCAL_STORAGE.CREATE_CHATTING_INFO,
    );

    if (chattingInfo) setChattingInfo(JSON.parse(chattingInfo));
  }, [setChattingInfo]);

  return null;
};
