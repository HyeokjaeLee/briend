'use client';

import type { z } from 'zod';

import { getSession } from 'next-auth/react';

import { useEffect, use, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import {
  CustomButton,
  BottomButton,
  ProfileImage,
  ValidationMessage,
} from '@/components';
import { LANGUAGE, LANGUAGE_NAME } from '@/constants';
import { useCustomRouter, useTempImage, useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { editProfileSchema } from '@/schema/trpc/user';
import { useGlobalModalStore } from '@/stores';
import { assert, assertEnum } from '@/utils';
import { toast, uploadFirebaseStorage } from '@/utils/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, TextField } from '@radix-ui/themes';

import { ProfileImageChangeModal } from './_components/ProfileImageChangeModal';

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
      const session = await getSession();

      const user = session?.user;

      assert(user);

      return {
        language: lng,
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

  return (
    <article className="p-4">
      <form
        className="flex-col gap-8 flex-center"
        id={FORM_NAME}
        onSubmit={handleSubmit}
      >
        <section className="w-full flex-col gap-8 flex-center">
          <button
            className="relative cursor-pointer"
            type="button"
            onClick={() => setIsProfileImageModalOpen(true)}
          >
            <ProfileImage src={form.getValues('photoURL')} />
            <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-slate-200 p-2">
              <FaCamera className="size-4 text-slate-700" />
            </div>
          </button>
        </section>
        <CustomButton asChild className="w-full" variant="outline" />
        <label className="w-full font-semibold">
          {t('my-nickname')}
          <TextField.Root
            {...form.register('displayName')}
            className="mt-2 h-14 w-full rounded-xl px-1"
            placeholder={t('my-nickname')}
            size="3"
            variant="soft"
          />
          <ValidationMessage
            message={t(form.formState.errors.displayName?.message ?? '')}
          />
        </label>
        <label className="w-full font-semibold">
          {t('friend-language')}
          <Controller
            control={form.control}
            name="language"
            render={({ field }) => (
              <Select.Root
                size="3"
                value={field.value}
                onValueChange={(language) => {
                  assertEnum(LANGUAGE, language);

                  return field.onChange(language);
                }}
              >
                <Select.Trigger
                  className="mt-2 h-14 w-full rounded-xl"
                  variant="soft"
                />
                <Select.Content>
                  {Object.values(LANGUAGE).map((language) => {
                    return (
                      <Select.Item key={language} value={language}>
                        {LANGUAGE_NAME[language]}
                      </Select.Item>
                    );
                  })}
                </Select.Content>
              </Select.Root>
            )}
          />
        </label>
      </form>
      <ProfileImageChangeModal
        loading={tempProfileImage.isPending}
        open={isProfileImageModalOpen}
        onChangeProfileImage={async (file) => {
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
        }}
        onClose={() => setIsProfileImageModalOpen(false)}
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
