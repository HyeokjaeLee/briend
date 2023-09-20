import { shallow } from 'zustand/shallow';

import { useRouter, useSearchParams } from 'next/navigation';

import { LANGUAGE_PACK } from '@/constants';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Button, Modal, useToast } from '@hyeokjaelee/pastime-ui';

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

  const deviceLanguage = useGlobalStore((state) => state.deviceLanguage);

  return (
    <Modal
      opened={!!tokenToDelete}
      onClose={handleClose}
      className="flex flex-col"
    >
      <Modal.Header closeButton>
        <h1 className="font-bold text-2xl">
          {LANGUAGE_PACK.HISTORY_DELETE_TITLE[deviceLanguage]}
        </h1>
      </Modal.Header>
      <article className="pt-9 pb-4 px-2 font-medium text-sm">
        <div className="text-6xl text-center my-10">🤔</div>
        <p className="mb-1">
          {LANGUAGE_PACK.HISTORY_ONLY_SAVE_ON_DEVICE[deviceLanguage](
            opponentName,
          )}
        </p>
        <p>{LANGUAGE_PACK.HISTORY_REALLY_DELETE[deviceLanguage]}</p>
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
