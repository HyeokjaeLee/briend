import type dayjs from 'dayjs';

import { Lottie } from '@/components/atoms/Lottie';
import type { ChattingMessage } from '@/stores/chatting-db.';
import SendMessageLottie from '@assets/lottie/send-message.json';
import { Spinner } from '@radix-ui/themes';

interface MessageStateProps extends Pick<ChattingMessage, 'state'> {
  isSendComplete: boolean;
  onSendComplete: () => void;
  prevTime?: dayjs.Dayjs;
  time: dayjs.Dayjs;
}

export const MessageState = ({
  state,
  isSendComplete,
  onSendComplete,
  prevTime,
  time,
}: MessageStateProps) => {
  switch (state) {
    case 'sent':
      return <Spinner className="size-4" />;
    case 'receive': {
      if (isSendComplete)
        return (
          <div className="relative size-9">
            <Lottie
              async
              animationData={SendMessageLottie}
              className="absolute -right-2 cursor-wait"
              onComplete={onSendComplete}
            />
          </div>
        );

      const isSameMinute = !!(prevTime && prevTime.isSame(time, 'minute'));

      return (
        <time className="text-sm text-zinc-500">
          {isSameMinute ? null : time.format('HH:mm')}
        </time>
      );
    }
    case 'error':
      return null;
  }
};
