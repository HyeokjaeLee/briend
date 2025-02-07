import { trpc } from '@/app/trpc';

import { FriendCard } from './FriendCard';
import { DRAWER_SEARCH_PARAM } from './FriendInfoDrawer';

const EMPTY_FRIEND_LIST = new Array(20).fill(null);

export const FrinedListItems = () => {
  const getFriendListQuery = trpc.friend.getFriendList.useQuery();

  return (
    <>
      {getFriendListQuery.data
        ? getFriendListQuery.data?.friendList.map(({ id, name = '' }) => (
            <li key={id}>
              <FriendCard
                href={`?${DRAWER_SEARCH_PARAM}=${id}`}
                id={id}
                name={name}
              />
            </li>
          ))
        : EMPTY_FRIEND_LIST.map((_, index) => (
            <li key={index}>
              <FriendCard loading />
            </li>
          ))}
    </>
  );
};
