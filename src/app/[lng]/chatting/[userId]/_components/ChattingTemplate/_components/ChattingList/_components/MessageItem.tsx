import dayjs from 'dayjs';

import { ProfileImage } from '@/components';
import type { MessageTableItem } from '@/database/indexed-db';
import { useLanguage } from '@/hooks';

interface MessageItemProps extends MessageTableItem {
  profileImageSrc?: string;
}

export const MessageItem = ({
  message,
  timestamp,
  profileImageSrc,
}: MessageItemProps) => {
  const { dayjsLocale } = useLanguage();

  return (
    <article className="animate-fade-up">
      <time>{dayjs(timestamp).locale(dayjsLocale).format('A h:mm')}</time>
      <ProfileImage size="4" src={profileImageSrc} />
      {message}
    </article>
  );
};
