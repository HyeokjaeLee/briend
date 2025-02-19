'use client';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
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

  const deleteFriendMutation = trpc.friend.remove.useMutation({
    onSuccess: (_, { uid, type }) => {
      if (type === 'delete' && sidePanelUrl.includes(uid))
        sidePanel.push(ROUTES.FRIEND_LIST.pathname);

      utils.friend.list.invalidate();

      onSuccess?.();

      toast({
        message: t('delete-friend-toast-message'),
      });
    },
  });

  return (
    <ConfirmModal
      footer={
        <footer className="flex w-full gap-2">
          <CustomButton className="flex-1">{t('unlink-button')}</CustomButton>
          <CustomButton
            className="flex-1"
            variant="outline"
            onClick={() => {
              assert(friendId);

              deleteFriendMutation.mutate({
                type: 'delete',
                uid: friendId,
              });

              onClose?.();
            }}
          >
            {t('delete-button')}
          </CustomButton>
        </footer>
      }
      message={t('delete-friend-sub-message')}
      opened={opened}
      title={t('delete-friend-message')}
      onClose={onClose}
    />
  );
};
