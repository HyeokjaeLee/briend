import { trpc } from '@/app/trpc';
import { assert } from '@/utils';

export const useReceiverData = (userId: string) => {
  const { data, isLoading } = trpc.friend.getFriendList.useQuery(undefined, {
    select: ({ friendList }) =>
      friendList.find((friend) => friend.id === userId),
  });

  assert(data?.name);

  return { receiver: data, isLoading, receiverName: data.name };
};
