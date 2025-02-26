'use client';

import { useTranslation } from '@/configs/i18n/client';
import { trpc } from '@/configs/trpc';
import { ConfirmModal, CustomButton } from '@/components';
import { useSidePanel } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useSidePanelStore } from '@/stores';
import { assert } from '@/utils';
import { toast } from '@/utils/client';

interface FriendDeleteModalProps {
  friendId: string | null;
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FriendDeleteModal = ({
  friendId,
  opened,
  onClose,
  onSuccess,
}: FriendDeleteModalProps) => {
  const { t } = useTranslation('friend-list');

  const sidePanel = useSidePanel();

  const sidePanelUrl = useSidePanelStore((state) => state.sidePanelUrl);

  const utils = trpc.useUtils();

  const isUnlinked = !utils.friend.list
    .getData()
    ?.friendList.find((friend) => friend.id === friendId)?.isLinked;

  const deleteFriendMutation = trpc.friend.remove.useMutation({
    onSuccess: (_, { uid, type }) => {
      if (type === 'delete' && sidePanelUrl.includes(uid))
        sidePanel.push(ROUTES.FRIEND_LIST.pathname);

      utils.friend.list.invalidate();

      onSuccess?.();

      toast({
        message:
          type === 'delete'
            ? t('delete-friend-toast-message')
            : t('unlink-friend-toast-message'),
      });

      onClose?.();
    },
  });

  return (
    <ConfirmModal
      footer={
        <footer className="flex w-full gap-2">
          <CustomButton
            className="flex-1"
            disabled={isUnlinked || deleteFriendMutation.isPending}
            onClick={() => {
              assert(friendId);

              deleteFriendMutation.mutate({
                type: 'unsubscribe',
                uid: friendId,
              });
            }}
          >
            {t('unlink-button')}
          </CustomButton>
          <CustomButton
            className="flex-1"
            variant="outline"
            loading={deleteFriendMutation.isPending}
            onClick={() => {
              assert(friendId);

              deleteFriendMutation.mutate({
                type: 'delete',
                uid: friendId,
              });
            }}
          >
            {t('delete-button')}
          </CustomButton>
        </footer>
      }
      message={
        isUnlinked
          ? t('delete-friend-sub-message2')
          : t('delete-friend-sub-message')
      }
      opened={opened}
      title={t('delete-friend-message')}
      onClose={onClose}
    />
  );
};
