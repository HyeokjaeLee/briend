import { useTranslation } from '@/app/i18n/client';
import {
  friendTable,
  messageTable,
  profileImageTable,
} from '@/database/indexed-db';
import { toast } from '@/utils/client';

export const useDeleteFriend = () => {
  const { t } = useTranslation('hooks');
  const deleteFriend = async (friendId: string) => {
    await friendTable?.delete(friendId);

    await messageTable?.where('fromUserId').equals(friendId).delete();

    await profileImageTable?.delete(friendId);

    toast({
      message: t('delete-friend-toast-message'),
    });
  };

  return { deleteFriend };
};
