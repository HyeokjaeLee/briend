import { useEffect } from 'react';

import { CHANNEL_EVENT } from '@/constants';
import { useGlobalStore } from '@/store/useGlobalStore';
import { ChattingRoom } from '@/types';
import { naming } from '@/utils/naming';
import { useToast } from '@hyeokjaelee/pastime-ui';

type UseCheckJoinParams = Pick<ChattingRoom, 'hostId' | 'guestName'>;

export const useCheckJoin = ({ hostId, guestName }: UseCheckJoinParams) => {
  const pusher = useGlobalStore((state) => state.pusher);
  const { toast } = useToast();

  useEffect(() => {
    if (pusher) {
      const channel = pusher.subscribe(
        naming.chattingChannel(hostId, guestName),
      );

      console.log(hostId, guestName, naming.chattingChannel(hostId, guestName));

      channel.bind(CHANNEL_EVENT.JOIN_CHANNEL, () => {
        toast({
          message: 'test',
        });
      });

      return () => {
        channel.unbind(CHANNEL_EVENT.JOIN_CHANNEL);
      };
    }
  }, [guestName, hostId, pusher, toast]);
};
