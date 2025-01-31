import { useTranslation } from '@/app/i18n/client';
import { CustomButton, Modal } from '@/components';
import { assert } from '@/utils';

interface ProfileImageChangeModalProps {
  open?: boolean;
  onClose?: () => void;
  onChangeProfileImage?: (file: File | null) => void;
  loading?: boolean;
}

export const ProfileImageChangeModal = ({
  open,
  onClose,
  onChangeProfileImage,
  loading,
}: ProfileImageChangeModalProps) => {
  const { t } = useTranslation('edit-profile');

  return (
    <Modal
      hasCloseButton
      loading={loading}
      open={open}
      title={t('profile-image-change')}
      onClose={onClose}
    >
      <footer className="mt-auto flex w-full gap-2">
        <CustomButton
          size="4"
          variant="outline"
          onClick={() => {
            onChangeProfileImage?.(null);
          }}
        >
          {t('use-default-image')}
        </CustomButton>
        <CustomButton asChild size="4">
          <label>
            {t('select-on-gallery')}
            <input
              accept="image/*"
              className="hidden"
              id="image-upload"
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];

                assert(file);

                onChangeProfileImage?.(file);
              }}
            />
          </label>
        </CustomButton>
      </footer>
    </Modal>
  );
};
