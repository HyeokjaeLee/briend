import { useTranslation } from '@/app/i18n/client';
import { CustomButton, Modal } from '@/components';
import { useGetLocalImage } from '@/hooks';
import { CustomError, ERROR } from '@/utils';

interface ProfileImageChangeModalProps {
  open?: boolean;
  onClose?: () => void;
  onChangeProfileImage?: (file: File | null) => void;
}

export const ProfileImageChangeModal = ({
  open,
  onClose,
  onChangeProfileImage,
}: ProfileImageChangeModalProps) => {
  const { getImage, isLoading } = useGetLocalImage();
  const { t } = useTranslation('edit-profile');

  return (
    <Modal
      hasCloseButton
      open={open}
      title={t('profile-image-change')}
      onClose={onClose}
    >
      <footer className="mt-auto flex w-full gap-2">
        <CustomButton
          disabled={isLoading}
          size="3"
          variant="outline"
          onClick={() => {
            onChangeProfileImage?.(null);
            onClose?.();
          }}
        >
          {t('use-default-image')}
        </CustomButton>
        <CustomButton asChild disabled={isLoading} size="3">
          <label>
            {t('select-on-gallery')}
            <input
              accept="image/*"
              className="hidden"
              id="image-upload"
              type="file"
              onChange={async (e) => {
                if (isLoading) return;

                const file = e.target.files?.[0];

                if (!file)
                  throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['file']));

                const blob = await getImage(file);

                onClose?.();

                onChangeProfileImage?.(blob);
              }}
            />
          </label>
        </CustomButton>
      </footer>
    </Modal>
  );
};
