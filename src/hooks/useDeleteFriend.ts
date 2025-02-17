import { useTranslation } from '@/app/i18n/client';
import { toast } from '@/utils/client';

export const useDeleteFriend = () => {
  const { t } = useTranslation('hooks');
  const deleteFriend = async (friendId: string) => {
    console.info('deleteFriend', friendId);
    toast({
      message: t('delete-friend-toast-message'),
    });
  };

  return { deleteFriend };
};
