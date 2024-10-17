import { useEffect, useState } from 'react';

import { LANGUAGE } from '@/constants/language';
import { LOCAL_STORAGE } from '@/constants/storage-key';

interface ChattingInfo {
  index: number;
  language: LANGUAGE;
}

export const useChattingInfo = () => {
  const [chattingInfo, setChattingInfo] = useState<ChattingInfo>();

  useEffect(() => {
    const chattingInfo = localStorage.getItem(
      LOCAL_STORAGE.CREATE_CHATTING_INFO,
    );

    if (!chattingInfo)
      return setChattingInfo({
        index: 0,
        language: LANGUAGE.ENGLISH,
      });

    setChattingInfo(JSON.parse(chattingInfo));
  }, []);

  return {
    chattingInfo,
    setChattingInfo: (chattingInfo: ChattingInfo) => {
      localStorage.setItem(
        LOCAL_STORAGE.CREATE_CHATTING_INFO,
        JSON.stringify(chattingInfo),
      );

      setChattingInfo(chattingInfo);
    },
  };
};