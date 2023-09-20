import { useTempMessageStore } from '@/store/useTempMessageStore';
import { Drawer } from '@hyeokjaelee/pastime-ui';

import { Message } from './Message';

export const SendingMessageDrawer = () => {
  const sendingMessageMap = useTempMessageStore(
    (state) => state.sendingMessageMap,
  );

  return (
    <Drawer
      opened={!!sendingMessageMap.size}
      backgroundScroll
      blurredBackground={false}
      drawerDirection="top"
    >
      <ul className="max-w-4xl m-auto w-full">
        {[...sendingMessageMap].map(([key, message]) => (
          <Message
            isMine
            originalMessage={message}
            key={key}
            createdAt={new Date(key)}
            isLoading
          />
        ))}
      </ul>
    </Drawer>
  );
};
