'use client';

import { omit } from 'es-toolkit';
import { getSession, useSession } from 'next-auth/react';
import { z } from 'zod';

import { useEffect, use, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaUser, FaCamera } from 'react-icons/fa';

import { useTranslation } from '@/app/i18n/client';
import type { SessionDataToUpdate } from '@/auth';
import { CustomButton } from '@/components/atoms/CustomButton';
import { Modal } from '@/components/atoms/Modal';
import { BottomButton } from '@/components/molecules/BottomButton';
import { ProfileImage } from '@/components/molecules/ProfileImage';
import { ValidationMessage } from '@/components/molecules/ValidationMessage';
import { LANGUAGE, LANGUAGE_NAME } from '@/constants/language';
import { profileImageTable } from '@/database/indexed-db';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { useGetLocalImage } from '@/hooks/useGetLocalImage';
import { useImageBlobUrl } from '@/hooks/useImageBlobUrl';
import { API_ROUTES } from '@/routes/api';
import { ROUTES } from '@/routes/client';
import { CustomError, ERROR } from '@/utils/customError';
import { isEnumValue } from '@/utils/isEnumValue';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Select, Skeleton, TextField } from '@radix-ui/themes';
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
      .optional(),
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
        profileImage: profileImage && omit(profileImage, ['userId']),
      };
    },
  });

  const profileBlob = form.watch('profileImage')?.blob;

  const { createBlobUrl, imageBlobUrl } = useImageBlobUrl();

  useEffect(() => {
    if (profileBlob) createBlobUrl(profileBlob);
  }, [createBlobUrl, profileBlob]);

  const router = useCustomRouter();

  const editProfileMutation = useMutation({
    mutationFn: API_ROUTES.EDIT_PROFILE,
    onSuccess: async ({ nickname }) => {
      await session.update({
        updatedProfile: {
          nickname,
        },
      } satisfies SessionDataToUpdate);

      toast({
        message: t('save-profile'),
      });

      router.push(
        `/${form.getValues('language')}${ROUTES.MORE_MENUS.pathname}`,
      );
    },
    onError: () => {
      toast({
        message: t('error-save-profile'),
        type: 'fail',
      });
    },
  });

  const { isLoading, getImage } = useGetLocalImage();

  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);

  return (
    <article className="p-4">
      <form
        className="flex-col gap-8 flex-center"
        id={FORM_NAME}
        onSubmit={form.handleSubmit(
          async ({ language, nickname, profileImage }) => {
            if (!user) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['user']));

            if (nickname === user.name && lng === language)
              return toast({
                type: 'fail',
                message: t('no-change'),
              });

            /**
     *         profileImageTable?.put({
              userId: user?.id,
              blob,
              type: file.type,
              updatedAt: Date.now(),
            });
     */

            editProfileMutation.mutate({
              nickname,
            });
          },
        )}
      >
        <section className="w-full flex-col gap-8 flex-center">
          <button
            className="relative cursor-pointer"
            type="button"
            onClick={() => setIsProfileImageModalOpen(true)}
          >
            <ProfileImage loading={isLoading} src={imageBlobUrl} />
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
        onClose={() => setIsProfileImageModalOpen(false)}
      />
      <BottomButton
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
