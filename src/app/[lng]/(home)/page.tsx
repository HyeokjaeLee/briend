'use client';

import { useSession } from 'next-auth/react';
import { useShallow } from 'zustand/shallow';

import { CustomLink } from '@/components';
import { ROUTES } from '@/routes/client';
import {
  useFriendStore,
  MEDIA_QUERY_BREAK_POINT,
  useGlobalStore,
  usePeerStore,
} from '@/stores';
import { Avatar } from '@radix-ui/themes';

import { FriendCard } from './_components/FriendCard';

const ChattingListPage = () => {
  const [friendList] = useFriendStore(
    useShallow((state) => [state.friendList]),
  );

  const friendConnectionMap = usePeerStore(
    (state) => state.friendConnectionMap,
  );

  const session = useSession();
  const user = session.data?.user;

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
