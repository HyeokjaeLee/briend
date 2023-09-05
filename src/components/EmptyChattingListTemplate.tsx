import { UserPlus } from 'react-feather';

import { useLayoutStore } from '@/hooks/useLayoutStore';
import { Button } from '@hyeokjaelee/pastime-ui';

export const EmptyChattingListTemplate = () => {
  const setAddChattingRoomModalOpened = useLayoutStore(
    (state) => state.setAddChattingRoomModalOpened,
  );

  return (
    <section className="text-blue-100 flex flex-col items-center justify-center h-page gap-3">
      <h1 className="text-3xl font-semibold">😢 이전 대화가 없어요</h1>
      <p className="font-normal">새로 친구를 초대해볼까요?</p>
      <Button
        className="font-bold"
        icon={<UserPlus className="ml-1" />}
        onClick={() => setAddChattingRoomModalOpened(true)}
      >
        친구 초대
      </Button>
    </section>
  );
};
