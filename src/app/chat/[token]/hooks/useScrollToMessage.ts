import { useEffect, useRef } from 'react';

import type { Message } from '@/types';

export const useScrollToMessage = (
  messageList: Message[] | null | undefined,
  sendingMessageList: [number, string][],
) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  }, [messageList, sendingMessageList]);

  return {
    messageRef: ref,
  };
};
