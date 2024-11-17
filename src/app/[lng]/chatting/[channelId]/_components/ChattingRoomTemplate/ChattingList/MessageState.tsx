import { Lottie } from '@/components/atoms/Lottie';
import type { ChattingMessage } from '@/stores/chatting-db.';
import SendMessageLottie from '@assets/lottie/send-message.json';
import { Spinner } from '@radix-ui/themes';

interface MessageStateProps extends Pick<ChattingMessage, 'state'> {
  isSendComplete: boolean;
  onSendComplete: () => void;
  date: string | null;
}

export const MessageState = ({
  state,
  isSendComplete,
  onSendComplete,
  date,
}: MessageStateProps) => {
  switch (state) {
    case 'sent':
      return <Spinner className="size-4" />;
    case 'receive':
      return isSendComplete ? (
        <div className="relative size-9">
          <Lottie
            async
            animationData={SendMessageLottie}
            className="absolute -right-2 cursor-wait"
            onComplete={onSendComplete}
          />
        </div>
      ) : (
        <time>{date}</time>
      );
    case 'error':
      return null;
  }
};
