'use client';

import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { shallow } from 'zustand/shallow';

import { Controller, useForm } from 'react-hook-form';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { ValidationMessage } from '@/components/ValidationMessage';
import { LANGUAGE } from '@/constants/language';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { API_ROUTES } from '@/routes/api';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores/global';
import { CustomError, ERROR } from '@/utils/customError';
import { isEnumValue } from '@/utils/isEnumValue';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, TextField } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
export interface QrInfo {
  userId: string;
  language: LANGUAGE;
  nickname: string;
  emoji: string;
  expires: string;
}

export const InviteForm = () => {
  const session = useSession();

  const user = session.data?.user;

  const { t } = useTranslation('invite-chat');

  const formSchema = z.object({
    language: z.nativeEnum(LANGUAGE),
    nickname: z.string().max(10, t('nickname-max-length')),
  });

  type FriendSchema = z.infer<typeof formSchema>;

  const router = useCustomRouter();

  const [chattingInfo, setChattingInfo] = useGlobalStore(
    (state) => [state.chattingInfo, state.setChattingInfo],
    shallow,
  );

  const { control, handleSubmit, register, formState } = useForm<FriendSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    values: {
      language: chattingInfo.language,
      nickname: '',
    },
  });

  const nicknamePlaceholder = `Friend ${chattingInfo.index}`;

  const createChatMutation = useMutation({
    mutationFn: API_ROUTES.CREATE_CHAT,
    onSuccess: ({ inviteToken }) => {
      const href = ROUTES.INVITE_CHAT_QR.pathname({
        inviteToken,
      });

      router.push(href);
    },
  });

  if (formState.isLoading) return null;

  return (
    <form
      className="mx-auto flex w-full animate-fade flex-col items-center gap-4"
      onSubmit={handleSubmit(async ({ language, nickname }) => {
        if (!user) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['user']));

        createChatMutation.mutate({
          userId: user.id,
          language,
          nickname: nickname || nicknamePlaceholder,
          emoji: user.emoji,
        });
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
                  throw new CustomError(ERROR.UNKNOWN_VALUE('language'));

                setChattingInfo((prev) => {
                  prev.language = language;

                  return prev;
                });

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
        loading={formState.isSubmitting || createChatMutation.isPending}
        type="submit"
      >
        {t('invite-button')}
      </CustomButton>
    </form>
  );
};
