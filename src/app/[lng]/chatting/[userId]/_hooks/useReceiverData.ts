import { trpc } from '@/configs/trpc';
import { assert } from '@/utils';

export const useReceiverData = (userId: string) => {
  const { data, isLoading } = trpc.friend.list.useQuery(undefined, {
    select: ({ friendList }) =>
      friendList.find((friend) => friend.id === userId),
  });

  assert(data?.name);

  return { receiver: data, isLoading, receiverName: data.name };
};
