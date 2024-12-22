'use client';

import { omit } from 'es-toolkit';
import { getSession, useSession } from 'next-auth/react';
import { z } from 'zod';

import { useEffect, use, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa';

import { useTranslation } from '@/app/i18n/client';
import type { SessionDataToUpdate } from '@/auth';
import {
  CustomButton,
  BottomButton,
  ProfileImage,
  ValidationMessage,
} from '@/components';
import { LANGUAGE, LANGUAGE_NAME } from '@/constants';
import { profileImageTable } from '@/database/indexed-db';
import { useCustomRouter, useImageBlobUrl } from '@/hooks';
import { API_ROUTES } from '@/routes/api';
import { ROUTES } from '@/routes/client';
import { useGlobalModalStore } from '@/stores';
import { CustomError, ERROR, isEnumValue } from '@/utils';
import { toast } from '@/utils/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, TextField } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';

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

  const session = useSession();

  const user = session.data?.user;

  const formSchema = z.object({
    language: z.nativeEnum(LANGUAGE),
    nickname: z.string().max(20, t('nickname-max-length')),
    profileImage: z
      .object({
        type: z.string(),
        blob: z.instanceof(Blob),
        updatedAt: z.number(),
      })
      .nullable(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: async () => {
      const session = await getSession();

      const user = session?.user;

      if (!user) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['user']));

      const profileImage = await profileImageTable?.get(user.id);

      return {
        language: lng,
        nickname: user.name ?? 'Unknown',
        profileImage: profileImage ? omit(profileImage, ['userId']) : null,
      };
    },
  });

  const setBackNoticeInfo = useGlobalModalStore(
    (state) => state.setBackNoticeInfo,
  );

  const [profileImageSrc, dispatchProfileImage] = useImageBlobUrl();

  const { blob: profileImageBlob, updatedAt: profileImageUpdateAt } =
    form.watch('profileImage') ?? {};

  useEffect(() => {
    if (!profileImageBlob) return dispatchProfileImage({ type: 'REVOKE' });

    dispatchProfileImage({ type: 'CREATE', payload: profileImageBlob });
  }, [dispatchProfileImage, profileImageBlob]);

  const editProfileMutation = useMutation({
    mutationFn: API_ROUTES.EDIT_PROFILE,
  });

  const isNoChanged =
    !form.formState.isDirty &&
    form.formState.defaultValues?.profileImage?.updatedAt ===
      profileImageUpdateAt;

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

  const handleSubmit = form.handleSubmit(async ({ nickname, profileImage }) => {
    try {
      if (!user) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['user']));

      editProfileMutation.mutate(
        {
          nickname,
        },
        {
          onSuccess: async () => {
            await session.update({
              updatedProfile: {
                nickname,
              },
            } satisfies SessionDataToUpdate);
          },
        },
      );

      if (profileImage)
        await profileImageTable?.put({
          ...profileImage,
          userId: user.id,
        });

      toast({
        message: t('save-profile'),
      });

      const language = form.getValues('language');

      const nextPathname = `/${language}${ROUTES.MORE_MENUS.pathname}`;

      if (language === lng) return router.push(nextPathname);

      location.href = nextPathname;
    } catch {
      toast({
        message: t('error-save-profile'),
        type: 'fail',
      });
    }
  });

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
            <ProfileImage src={profileImageSrc} />
            <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-slate-200 p-2">
              <FaCamera className="size-4 text-slate-700" />
            </div>
          </button>
        </section>
        <CustomButton asChild className="w-full" variant="outline" />
        <label className="w-full font-semibold">
          {t('my-nickname')}
          <TextField.Root
            {...form.register('nickname')}
            className="mt-2 h-14 w-full rounded-xl px-1"
            placeholder={t('my-nickname')}
            size="3"
            variant="soft"
          />
          <ValidationMessage
            message={form.formState.errors.nickname?.message}
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
                  if (!isEnumValue(LANGUAGE, language))
                    throw new CustomError(ERROR.UNKNOWN_VALUE('language'));

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
        open={isProfileImageModalOpen}
        onChangeProfileImage={(file) => {
          if (!file) return form.setValue('profileImage', null);

          form.setValue('profileImage', {
            blob: file,
            type: file.type,
            updatedAt: Date.now(),
          });
        }}
        onClose={() => setIsProfileImageModalOpen(false)}
      />
      <BottomButton
        disabled={isNoChanged}
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
