'use client';

import { z } from 'zod';

import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Controller, useForm } from 'react-hook-form';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { ValidationMessage } from '@/components/ValidationMessage';
import { COOKIES } from '@/constants/cookies-key';
import { LANGUAGE } from '@/constants/language';
import { LOCAL } from '@/constants/storage-key';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { API_ROUTES } from '@/routes/api';
import { ROUTES } from '@/routes/client';
import type { LocalStorage } from '@/types/storage';
import { CustomError } from '@/utils/customError';
import { isEnumValue } from '@/utils/isEnumValue';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, TextField } from '@radix-ui/themes';
export interface QrInfo {
  userId: string;
  language: LANGUAGE;
  nickname: string;
  emoji: string;
  expires: string;
}

export const InviteForm = () => {
  const [cookies] = useCookies([COOKIES.MY_EMOJI, COOKIES.USER_ID]);

  const userId = cookies[COOKIES.USER_ID];

  if (!userId && typeof window !== 'undefined')
    throw new Error('User is not found');

  const { t } = useTranslation('invite-chat');

  const formSchema = z.object({
    language: z.nativeEnum(LANGUAGE),
    nickname: z.string().max(10, t('nickname-max-length')),
  });

  type FriendInfo = z.infer<typeof formSchema>;

  const router = useCustomRouter();

  const [friendIndex, setFriendIndex] = useState(0);

  const { control, handleSubmit, register, formState } = useForm<FriendInfo>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: async () => {
      const defaultValues: FriendInfo = {
        language: LANGUAGE.ENGLISH,
        nickname: '',
      };

      const stringifiedChattingInfo = localStorage.getItem(
        LOCAL.CREATE_CHATTING_INFO,
      );

      if (stringifiedChattingInfo) {
        const { friendIndex, language }: LocalStorage.CreateChattingInfo =
          JSON.parse(stringifiedChattingInfo);

        setFriendIndex(friendIndex);
        defaultValues.language = language;
      }

      return defaultValues;
    },
  });

  const nicknamePlaceholder = `Friend ${friendIndex}`;

  if (formState.isLoading) return null;

  return (
    <form
      className="mx-auto flex w-full animate-fade flex-col items-center gap-4"
      onSubmit={handleSubmit(async ({ language, nickname }) => {
        const { inviteToken } = await API_ROUTES.CREATE_CHAT({
          userId,
          language,
          nickname: nickname || nicknamePlaceholder,
          emoji: cookies[COOKIES.MY_EMOJI],
        });

        const href = ROUTES.INVITE_CHAT_QR.pathname({
          inviteToken,
        });

        router.prefetch(href);

        await new Promise((resolve) => setTimeout(resolve, 2_000));

        router.push(href);
      })}
    >
      <label className="w-full font-semibold">
        {t('friend-nickname')}
        <TextField.Root
          {...register('nickname')}
          className="mt-2 h-14 w-full rounded-xl px-1"
          placeholder={nicknamePlaceholder}
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
                  throw new CustomError({
                    message: 'Invalid language',
                  });

                localStorage.setItem(
                  LOCAL.CREATE_CHATTING_INFO,
                  JSON.stringify({
                    friendIndex,
                    language,
                  } satisfies LocalStorage.CreateChattingInfo),
                );

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
                      {t(language)}
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select.Root>
          )}
        />
      </label>
      <p className="text-center text-sm text-slate-350">
        {t('friend-setting-message')}
      </p>
      <CustomButton
        className="mt-8 w-full"
        loading={formState.isSubmitting}
        size="4"
      >
        {t('invite-button')}
      </CustomButton>
    </form>
  );
};
