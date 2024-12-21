'use client';

import { getSession, useSession } from 'next-auth/react';
import { z } from 'zod';

import { useEffect, use } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaUser, FaCamera } from 'react-icons/fa';

import { useTranslation } from '@/app/i18n/client';
import type { SessionDataToUpdate } from '@/auth';
import { CustomButton } from '@/components/atoms/CustomButton';
import { BottomButton } from '@/components/molecules/BottomButton';
import { ValidationMessage } from '@/components/molecules/ValidationMessage';
import { LANGUAGE, LANGUAGE_NAME } from '@/constants/language';
import { profileImageTable } from '@/database/indexed-db';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { useGetLocalImage } from '@/hooks/useGetLocalImage';
import { useImageBlobUrl } from '@/hooks/useImageBlobUrl';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { API_ROUTES } from '@/routes/api';
import { ROUTES } from '@/routes/client';
import { CustomError, ERROR } from '@/utils/customError';
import { isEnumValue } from '@/utils/isEnumValue';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Select, Skeleton, TextField } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';

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

  const formSchema = z.object({
    language: z.nativeEnum(LANGUAGE),
    nickname: z.string().max(20, t('nickname-max-length')),
    profileImageUpdatedAt: z.date().optional(),
  });

  type ProfileSchema = z.infer<typeof formSchema>;

  const session = useSession();

  const user = session.data?.user;

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: async () => {
      const session = await getSession();

      const user = session?.user;

      if (!user) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['user']));

      return {
        language: lng,
        nickname: user.name ?? 'Unknown',
      };
    },
  });

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

  const { createBlobUrl, imageBlobUrl } = useImageBlobUrl();

  const profileImage = useIndexedDB(
    profileImageTable,
    (table) => {
      if (!user?.id) return;

      return table.get(user.id);
    },
    [user?.id],
  );

  useEffect(() => {
    if (profileImage?.blob) createBlobUrl(profileImage.blob);
  }, [createBlobUrl, profileImage?.blob]);

  return (
    <article className="p-4">
      <form
        className="flex-col gap-8 flex-center"
        id={FORM_NAME}
        onSubmit={form.handleSubmit(async ({ language, nickname }) => {
          if (!user) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['user']));

          if (nickname === user.name && lng === language)
            return toast({
              type: 'fail',
              message: t('no-change'),
            });

          editProfileMutation.mutate({
            nickname,
          });
        })}
      >
        <section className="w-full flex-col gap-8 flex-center">
          <Skeleton loading={isLoading}>
            <label
              className="relative cursor-pointer rounded-full"
              htmlFor="image-upload"
            >
              <Avatar
                fallback={<FaUser className="size-12 text-white" />}
                radius="full"
                size="7"
                src={imageBlobUrl}
              />
              <input
                accept="image/*"
                className="hidden"
                id="image-upload"
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];

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
                }}
              />
              <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-slate-200 p-2">
                <FaCamera className="size-4 text-slate-700" />
              </div>
            </label>
          </Skeleton>
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
