'use client';

import { useSearchParams } from 'next/navigation';

import { useTranslation } from '@/app/i18n/client';
import { ConfirmModal, CustomButton } from '@/components';
import { useCustomRouter, useDeleteFriend } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { assert } from '@/utils';

import { DRAWER_SEARCH_PARAM } from './FriendInfoDrawer';

interface FriendDeleteModalProps {
  opened: boolean;
  onClose?: () => void;
}

export const FriendDeleteModal = ({
  opened,
  onClose,
}: FriendDeleteModalProps) => {
  const { t } = useTranslation('friend-list');

  const searchParams = useSearchParams();

  const userId = searchParams.get(DRAWER_SEARCH_PARAM);

  const { deleteFriend } = useDeleteFriend();

  const router = useCustomRouter();

  return (
    <ConfirmModal
      footer={
        <footer className="flex w-full gap-4">
          <CustomButton className="flex-1">{t('unlink-button')}</CustomButton>
          <CustomButton
            className="flex-1"
            variant="outline"
            onClick={() => {
              assert(userId);

              deleteFriend(userId);

              onClose?.();

              router.replace(ROUTES.FRIEND_LIST.pathname);
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
