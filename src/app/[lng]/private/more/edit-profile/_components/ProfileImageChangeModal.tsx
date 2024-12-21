import { CustomButton } from '@/components/atoms/CustomButton';
import { Modal } from '@/components/atoms/Modal';
import { ProfileImage } from '@/components/molecules/ProfileImage';

interface ProfileImageChangeModalProps {
  imageBlobUrl: string;
  loading?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export const ProfileImageChangeModal = ({
  imageBlobUrl,
  loading,
  open,
  onClose,
}: ProfileImageChangeModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ProfileImage
        className="m-auto"
        loading={loading}
        size="8"
        src={imageBlobUrl}
      />
      <footer className="flex w-full flex-col gap-2">
        <CustomButton asChild className="w-full">
          <label>
            앨범에서 선택
            <input
              accept="image/*"
              className="hidden"
              id="image-upload"
              type="file"
              onChange={async (e) => {
                /**
              *  const file = e.target.files?.[0];

              if (!user || !file)
                throw new CustomError(
                  ERROR.NOT_ENOUGH_PARAMS(['user', 'file']),
                );

              const blob = await getImage(file);

              createBlobUrl(blob);

              profileImageTable?.put({
                userId: user?.id,
                blob,
                type: file.type,
                updatedAt: Date.now(),
              });
              */
              }}
            />
          </label>
        </CustomButton>
        <CustomButton className="w-full" variant="outline">
          기본 이미지 적용
        </CustomButton>
      </footer>
    </Modal>
  );
};
