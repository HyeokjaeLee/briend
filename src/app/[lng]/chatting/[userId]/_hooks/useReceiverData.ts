import { trpc } from '@/configs/trpc';
import { assert } from '@/utils';

export const useReceiverData = (userId: string) => {
  const { data, isFetched } = trpc.friend.list.useQuery(undefined, {
    select: ({ friendList }) =>
      friendList.find((friend) => friend.id === userId),
  });

  if (!isFetched) return null;

  assert(data?.name);

  return { name: data.name, profileImage: data.profileImage };
};
