'use client';

import { useSession } from 'next-auth/react';

import { WebWorkerExample } from '@/components/WebWorkerExample';
import { CustomLink } from '@/components/atoms/CustomLink';
import { ROUTES } from '@/routes/client';
import { Avatar } from '@radix-ui/themes';

import { useFriendList } from './_hooks/useFriendList';

const ChattingListPage = () => {
  const friendList = useFriendList();
  const session = useSession();

  const isLogin = !!session.data;

  if (!isLogin) {
    return null;
  }

  return (
    <article>
      <ul>
        {friendList?.map((friend) => (
          <li key={friend.userId}>
            <CustomLink
              href={ROUTES.CHATTING_ROOM.pathname({
                channelId: friend.userId,
              })}
            >
              <div>
                <Avatar fallback={friend.emoji} size="7" />
              </div>
            </CustomLink>
          </li>
        ))}
      </ul>
      <WebWorkerExample />
    </article>
  );
};

export default ChattingListPage;
