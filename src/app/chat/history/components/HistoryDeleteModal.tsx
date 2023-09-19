import { shallow } from 'zustand/shallow';

import { useRouter, useSearchParams } from 'next/navigation';

import { useChattingDataStore } from '@/store/useChattingDataStore';
import { Button, Modal, Skeleton, useToast } from '@hyeokjaelee/pastime-ui';

export const HistoryDeleteModal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [deleteChattingRoom, chattingRoomList] = useChattingDataStore(
    (state) => [state.deleteChattingRoom, state.chattingRoomList],
    shallow,
  );

  const tokenToDelete = searchParams.get('delete');

  const chattingRoom = chattingRoomList.find(
    ({ token }) => token === tokenToDelete,
  );

  const handleClose = () =>
    router.replace('/chat/history', {
      scroll: false,
    });

  const { toast } = useToast();

  const opponentName = chattingRoom?.opponentName;

  return (
    <Modal
      opened={!!tokenToDelete}
      onClose={handleClose}
      className="flex flex-col"
    >
      <Modal.Header closeButton>
        <h1 className="font-semibold text-xl">대화 삭제</h1>
      </Modal.Header>
      <article className="py-9 px-2">
        <div className="text-6xl text-center my-10">🤔</div>
        <span className="font-bold text-sky-500">
          {opponentName || <Skeleton className="inline-block h-3 w-20" />}
        </span>{' '}
        님 과의 모든 대화는 사용자 기기에만 저장되어요!
        <br />
        만약 삭제한다면 복구 할 수 없는데 정말로 삭제하시겠어요?
      </article>
      <Button
        theme="danger"
        delay={3000}
        onClick={() => {
          if (tokenToDelete) deleteChattingRoom(tokenToDelete);
          handleClose();
          toast({
            message: `${chattingRoom?.opponentName}님과의 대화를 삭제했어요!`,
          });
        }}
      >
        삭제
      </Button>
    </Modal>
  );
};
