'use client';

import { useShallow } from 'zustand/shallow';

import { CustomLink } from '@/components/atoms/CustomLink';
import { ROUTES } from '@/routes/client';
import { useFriendStore } from '@/stores/friend';
import { MEDIA_QUERY_BREAK_POINT, useGlobalStore } from '@/stores/global';
import { usePeerStore } from '@/stores/peer';
import { Avatar } from '@radix-ui/themes';

import { FriendCard } from './_components/FriendCard';

const ChattingListPage = () => {
  const [friendList] = useFriendStore(
    useShallow((state) => [state.friendList]),
  );

  const friendConnectionMap = usePeerStore(
    (state) => state.friendConnectionMap,
  );

  return (
    <article>
      <ul>
        {friendList.map(({ userId, nickname }) => (
          <li key={userId}>
            <FriendCard friendUserId={userId} nickname={nickname} />
          </li>
        ))}
      </ul>
    </article>
  );
};

export default ChattingListPage;
