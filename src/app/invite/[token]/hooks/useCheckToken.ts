import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import type { decodeChattingRoomToken } from '@/utils/decodeCattingRoomToken';
import { useToast } from '@hyeokjaelee/pastime-ui';

export const useCheckToken = (
  decodedToken: ReturnType<typeof decodeChattingRoomToken>,
) => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!decodedToken) {
      toast({
        message: '유효하지 않은 토큰입니다.',
        type: 'fail',
      });
      router.replace('/private/invite');
    }
  }, [decodedToken, router, toast]);
};
