'use client';

import { useSearchParams } from 'next/navigation';

import { IoIosWarning } from 'react-icons/io';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton, Modal } from '@/components';
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
    <Modal
      hasCloseButton
      className="flex flex-col gap-4"
      open={opened}
      onClose={onClose}
    >
      <div className="rounded-full bg-zinc-100 p-5 flex-center">
        <IoIosWarning className="size-10 text-red-500" />
      </div>
      <strong className="text-center text-xl font-semibold">
        {t('delete-friend-message')}
      </strong>
      <p className="mx-10 text-center text-zinc-600">
        {t('delete-friend-sub-message')}
      </p>
      <footer className="mt-8 flex w-full gap-4">
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
    </Modal>
  );
};
