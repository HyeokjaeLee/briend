'use client';

import { useSession } from 'next-auth/react';
import { useShallow } from 'zustand/shallow';

import { CustomLink } from '@/components/atoms/CustomLink';
import { ROUTES } from '@/routes/client';
import { useFriendStore } from '@/stores/friend';
import { toast } from '@/utils/toast';
import { Avatar } from '@radix-ui/themes';

const ChattingListPage = () => {
  const [friendList] = useFriendStore(
    useShallow((state) => [state.friendList]),
  );

  return (
    <article>
      <ul>
        {friendList.map((friend) => (
          <li key={friend.userId}>
            <CustomLink
              onlyIntercept
              href={ROUTES.CHATTING_ROOM.pathname({
                userId: friend.userId,
              })}
            >
              <div>
                <Avatar fallback={friend.emoji} size="7" />
              </div>
            </CustomLink>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default ChattingListPage;
