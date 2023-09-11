import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { JoinPusherResponse } from '@/app/chat/[token]/api/join/route';
import { CHANNEL_EVENT, PATH } from '@/constants';
import { useGlobalStore } from '@/store/useGlobalStore';
import { ChattingRoom } from '@/types';
import { naming } from '@/utils/naming';
import { useToast } from '@hyeokjaelee/pastime-ui';

type UseCheckJoinParams = Pick<ChattingRoom, 'hostId' | 'guestName'>;

export const useCheckJoin = ({ hostId, guestName }: UseCheckJoinParams) => {
  const pusher = useGlobalStore((state) => state.pusher);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (pusher) {
      const channel = pusher.subscribe(
        naming.chattingChannel(hostId, guestName),
      );

      channel.bind(CHANNEL_EVENT.JOIN_CHANNEL, (data: JoinPusherResponse) => {
        if (!data.isHost) {
          router.push(`${PATH.CHAT}/${data.token}`);
          toast({
            message: `${guestName}님과 대화를 시작해요!`,
          });
        }
      });

      return () => {
        channel.unbind(CHANNEL_EVENT.JOIN_CHANNEL);
      };
    }
  }, [guestName, hostId, pusher, router, toast]);
};
