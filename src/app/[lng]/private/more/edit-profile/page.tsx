'use client';

import { getSession, useSession } from 'next-auth/react';
import { random } from 'node-emoji';
import { z } from 'zod';

import { useEffect, useReducer, use } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RiRefreshLine } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import type { SessionDataToUpdate } from '@/auth';
import { CustomButton } from '@/components/atoms/CustomButton';
import { CustomIconButton } from '@/components/atoms/CustomIconButton';
import { BottomButton } from '@/components/molecules/BottomButton';
import { ValidationMessage } from '@/components/molecules/ValidationMessage';
import { LANGUAGE, LANGUAGE_NAME } from '@/constants/language';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { API_ROUTES } from '@/routes/api';
import { ROUTES } from '@/routes/client';
import { cn } from '@/utils/cn';
import { CustomError, ERROR } from '@/utils/customError';
import { isEnumValue } from '@/utils/isEnumValue';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Select, Skeleton, TextField } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';

const createRandomEmojiList = () => {
  const randomEmojiList: string[] = [];

  while (randomEmojiList.length < 20) {
    const randomEmoji = random().emoji;

    if (!randomEmojiList.includes(randomEmoji)) {
      randomEmojiList.push(randomEmoji);
    }
  }

  return randomEmojiList;
};

interface ProfilePageProps {
  params: Promise<{
    lng: LANGUAGE;
  }>;
}

const FORM_NAME = 'edit-profile';

const EditProfilePage = (props: ProfilePageProps) => {
  const params = use(props.params);

  const { lng } = params;

  const [randomEmojiList, dispatchRandomEmojiList] = useReducer(
    () => createRandomEmojiList(),
    [],
  );

  const { t } = useTranslation('edit-profile');

  const formSchema = z.object({
    emoji: z.string(),
    language: z.nativeEnum(LANGUAGE),
    nickname: z.string().max(10, t('nickname-max-length')),
  });

  type ProfileSchema = z.infer<typeof formSchema>;

  const session = useSession();

  const user = session.data?.user;

  const {
    control,
    handleSubmit,
    register,
    formState,
    watch,
    setValue,
    getValues,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: async () => {
      const session = await getSession();

      const user = session?.user;

      if (!user) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['user']));

      return {
        emoji: user.emoji,
        language: lng,
        nickname: user.name ?? 'Unknown',
      };
    },
  });

  const selectedEmoji = watch('emoji');

  const hasRandomEmojiList = !!randomEmojiList.length;

  useEffect(() => {
    if (!hasRandomEmojiList) {
      dispatchRandomEmojiList();
    }
  }, [hasRandomEmojiList]);

  const router = useCustomRouter();

  const editProfileMutation = useMutation({
    mutationFn: API_ROUTES.EDIT_PROFILE,
    onSuccess: async ({ emoji, nickname }) => {
      await session.update({
        updatedProfile: {
          emoji,
          nickname,
        },
      } satisfies SessionDataToUpdate);

      toast({
        message: t('save-profile'),
      });

      router.push(`/${getValues('language')}${ROUTES.MORE_MENUS.pathname}`);
    },
    onError: () => {
      toast({
        message: t('error-save-profile'),
        type: 'fail',
      });
    },
  });

  return (
    <article className="p-4">
      <form
        className="flex-col gap-8 flex-center"
        id={FORM_NAME}
        onSubmit={handleSubmit(async ({ emoji, language, nickname }) => {
          if (!user) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['user']));

          if (
            emoji === user.emoji &&
            nickname === user.name &&
            lng === language
          )
            return toast({
              type: 'fail',
              message: t('no-change'),
            });

          editProfileMutation.mutate({
            emoji,
            nickname,
          });
        })}
      >
        <section className="w-full flex-col gap-8 flex-center">
          <Skeleton>
            <Avatar
              fallback={<span className="text-5xl">{selectedEmoji}</span>}
              radius="full"
              size="7"
            />
          </Skeleton>
          <Skeleton className="h-32 w-full" loading={!randomEmojiList.length}>
            <ul className="w-full flex-wrap gap-5 rounded-xl bg-sky-50 p-5 flex-center">
              {randomEmojiList.map((emoji) => (
                <li key={emoji} className="relative">
                  <CustomIconButton
                    className={cn('text-3xl', {
                      'bg-sky-500': selectedEmoji === emoji,
                    })}
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();

                      setValue('emoji', emoji);
                    }}
                  >
                    {emoji}
                  </CustomIconButton>
                </li>
              ))}
            </ul>
          </Skeleton>
        </section>
        <CustomButton
          className="w-full"
          variant="outline"
          onClick={() => {
            dispatchRandomEmojiList();
          }}
        >
          <RiRefreshLine className="size-7" />
          {t('change-random-emoji')}
        </CustomButton>
        <label className="w-full">
          {t('my-nickname')}
          <TextField.Root
            {...register('nickname')}
            className="mt-2 h-14 w-full rounded-xl px-1"
            placeholder={t('my-nickname')}
            size="3"
            variant="soft"
          />
          <ValidationMessage message={formState.errors.nickname?.message} />
        </label>
        <label className="w-full font-semibold">
          {t('friend-language')}
          <Controller
            control={control}
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
        loading={formState.isSubmitting || editProfileMutation.isPending}
        type="submit"
      >
        저장하기
      </BottomButton>
    </article>
  );
};

export default EditProfilePage;
