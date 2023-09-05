import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useChattingRoomInfoInfoList } from './useChattingRoomInfoInfoList';

export const useBindChattingRoomInfo = () => {
  const chattingRoomToken = useSearchParams().get('token');

  const chattingRoomInfoList = useChattingRoomInfoInfoList();

  const router = useRouter();
  const chattingRoomCount = chattingRoomInfoList?.length;
  useEffect(() => {
    if (!chattingRoomToken && chattingRoomCount) {
      const lastChattingRoomInfo = chattingRoomInfoList[chattingRoomCount - 1];
      if (lastChattingRoomInfo) {
        const { token } = lastChattingRoomInfo;

        router.replace(`?token=${token}`);
      }
    }
  }, [chattingRoomInfoList, chattingRoomToken, router, chattingRoomCount]);

  return {
    isChattingRoomExist: !!chattingRoomCount,
  };
};
