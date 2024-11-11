'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useShallow } from 'zustand/shallow';

import { Controller, useForm } from 'react-hook-form';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/atoms/CustomButton';
import { ValidationMessage } from '@/components/molecules/ValidationMessage';
import { LANGUAGE } from '@/constants/language';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { API_ROUTES } from '@/routes/api';
import { ROUTES } from '@/routes/client';
import { chattingRoomTable } from '@/stores/chatting-db.';
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

  const router = useCustomRouter();

  const [lastInviteLanguage, setLastInviteLanguage] = useGlobalStore(
    useShallow((state) => [
      state.lastInviteLanguage,
      state.setLastInviteLanguage,
    ]),
  );

  const chattingIndex =
    (useLiveQuery(() => chattingRoomTable.count()) || 0) + 1;

  const { control, handleSubmit, register, formState } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: async () => {
      return {
        language: lastInviteLanguage,
        nickname: '',
      };
    },
  });

  const nicknamePlaceholder = `Friend ${chattingIndex}`;

  const createChatMutation = useMutation({
    mutationFn: API_ROUTES.CREATE_CHAT_INVITE_TOKEN,
    onSuccess: ({ inviteToken }) =>
      router.push(ROUTES.INVITE_CHAT_QR.pathname({ inviteToken })),
  });

  return (
    <form
      className="mx-auto flex w-full flex-col items-center gap-4"
      onSubmit={handleSubmit(async ({ language, nickname }) => {
        if (!user) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['user']));

        createChatMutation.mutate({
          userId: user.id,
          language,
          guestNickname: nickname || nicknamePlaceholder,
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

                setLastInviteLanguage(language);

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
      <p className="text-center text-sm text-slate-500">
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
