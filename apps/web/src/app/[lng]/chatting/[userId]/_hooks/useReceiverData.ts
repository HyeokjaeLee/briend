import { trpc } from '@/configs/trpc';
import { assert } from '@/utils';

export const useReceiverData = (userId: string) => {
  const { data, isFetched, isLoading } = trpc.friend.list.useQuery(undefined, {
    select: ({ friendList }) =>
      friendList.find((friend) => friend.id === userId),
  });

  if (!isFetched || isLoading) return null;

  assert(data?.name);

  return data;
};

export type ReceiverData = Exclude<
  Awaited<ReturnType<typeof useReceiverData>>,
  null
>;
