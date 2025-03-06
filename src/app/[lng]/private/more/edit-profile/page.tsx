'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { use, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa';
import type { z } from 'zod';

import {
  Avatar,
  BottomButton,
  Button,
  Input,
  InputDecorator,
  Modal,
  Select,
} from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { trpc } from '@/configs/trpc';
import { LANGUAGE, LANGUAGE_NAME } from '@/constants';
import { useCustomRouter, useTempImage, useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { editProfileSchema } from '@/schema/trpc/user';
import { useGlobalModalStore } from '@/stores';
import { assert } from '@/utils';
import { toast, uploadFirebaseStorage } from '@/utils/client';

interface ProfilePageProps {
  params: Promise<{
    lng: LANGUAGE;
  }>;
}

const FORM_NAME = 'edit-profile';

const EditProfilePage = (props: ProfilePageProps) => {
  const params = use(props.params);

  const { lng } = params;

  const { t } = useTranslation('edit-profile');

  const { user, sessionUpdate } = useUserData();

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: async () => {
      assert(user);

      return {
        language: user.language,
        displayName: user.name ?? 'Unknown',
        photoURL: user.profileImage,
      };
    },
  });

  const setBackNoticeInfo = useGlobalModalStore(
    (state) => state.setBackNoticeInfo,
  );

  const isNoChanged = !form.formState.isDirty;

  useEffect(() => {
    if (isNoChanged) return;

    setBackNoticeInfo({
      message: t('back-notice-message'),
      title: t('back-notice-title'),
    });

    return () => setBackNoticeInfo(null);
  }, [setBackNoticeInfo, t, isNoChanged]);

  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);

  const router = useCustomRouter();

  const tempProfileImage = useTempImage();

  const editProfileMutation = trpc.user.editProfile.useMutation({
    onSuccess: async (updatedSession) => {
      await sessionUpdate({
        type: 'update-profile',
        data: updatedSession,
      });

      toast({
        message: t('save-profile'),
      });

      const isSameLanguage = updatedSession.language === lng;

      const moreMenuPathname = `/${updatedSession.language}${ROUTES.MORE_MENUS.pathname}`;

      if (isSameLanguage) {
        router.push(moreMenuPathname);
      } else {
        location.href = moreMenuPathname;
      }
    },
    onError: () => {
      toast({
        message: t('error-save-profile'),
        type: 'fail',
      });
    },
  });

  const handleSubmit = form.handleSubmit(
    async ({ displayName, language, photoURL }) => {
      assert(user);

      const tempProfileImageFile = tempProfileImage.data?.file;

      const profileImageUrl = tempProfileImageFile
        ? await uploadFirebaseStorage({
            file: tempProfileImageFile,
            path: (paths) => paths.profileImage(user.id),
          })
        : photoURL;

      editProfileMutation.mutate({
        displayName,
        language,
        photoURL: profileImageUrl,
      });
    },
  );

  const languageOptions = Object.values(LANGUAGE).map((language) => ({
    label: LANGUAGE_NAME[language],
    value: language,
  }));

  const handleChangeProfileImage = async (file: File | null) => {
    if (!file) {
      tempProfileImage.reset();
      setIsProfileImageModalOpen(false);

      return form.setValue('photoURL', null, {
        shouldDirty: true,
      });
    }

    const { objectUrl } = await tempProfileImage.mutateAsync(file, {
      onSuccess: () => {
        setIsProfileImageModalOpen(false);
      },
    });

    form.setValue('photoURL', objectUrl, {
      shouldDirty: true,
    });
  };

  return (
    <article className="p-4">
      <form
        className="flex-center flex-col gap-8"
        id={FORM_NAME}
        onSubmit={handleSubmit}
      >
        <section className="flex-center w-full flex-col gap-8">
          <button
            className="relative cursor-pointer"
            type="button"
            onClick={() => setIsProfileImageModalOpen(true)}
          >
            <Avatar
              src={form.getValues('photoURL')}
              size={26}
              userId={user?.id}
            />
            <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-slate-200 p-2">
              <FaCamera className="size-4 text-slate-700" />
            </div>
          </button>
        </section>
        <Button asChild className="w-full" variant="outline" />
        <InputDecorator
          label={t('my-nickname')}
          className="w-full"
          message={t(form.formState.errors.displayName?.message ?? '')}
        >
          <Input
            {...form.register('displayName')}
            className="mt-2"
            placeholder={t('my-nickname')}
            aria-invalid={!!form.formState.errors.displayName}
          />
        </InputDecorator>
        <InputDecorator label={t('friend-language')}>
          <Controller
            control={form.control}
            name="language"
            render={({ field }) => (
              <Select
                className="mt-2"
                value={field.value}
                options={languageOptions}
                onValueChange={(language) => {
                  return field.onChange(language);
                }}
              />
            )}
          />
        </InputDecorator>
      </form>
      <Modal
        loading={tempProfileImage.isPending}
        open={isProfileImageModalOpen}
        header={t('profile-image-change')}
        onOpenChange={setIsProfileImageModalOpen}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                handleChangeProfileImage(null);
              }}
            >
              {t('use-default-image')}
            </Button>
            <Button asChild>
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

                    handleChangeProfileImage(file);
                  }}
                />
              </label>
            </Button>
          </>
        }
      />
      <BottomButton
        disabled={isNoChanged || form.formState.isLoading}
        form={FORM_NAME}
        loading={form.formState.isSubmitting || editProfileMutation.isPending}
        type="submit"
      >
        {t('save')}
      </BottomButton>
    </article>
  );
};

export default EditProfilePage;
