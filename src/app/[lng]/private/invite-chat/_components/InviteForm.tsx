'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/components';
import { Select } from '@/components/atoms/Select';
import { useTranslation } from '@/configs/i18n/client';
import { trpc } from '@/configs/trpc';
import { LANGUAGE } from '@/constants';
import { useCustomRouter, useLanguage, useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { createInviteTokenSchema } from '@/schema/trpc/chat';
import { useGlobalStore } from '@/stores';
import { assert } from '@/utils';

export interface QrInfo {
  userId: string;
  language: LANGUAGE;
  nickname: string;
  expires: string;
}

export const InviteForm = () => {
  const { user } = useUserData();

  const { t } = useTranslation('invite-chat');

  const router = useCustomRouter();

  const hasSidePanel = useGlobalStore((state) => state.hasSidePanel);

  const { lng } = useLanguage();

  const { control, handleSubmit, formState } = useForm<
    z.infer<typeof createInviteTokenSchema>
  >({
    resolver: zodResolver(createInviteTokenSchema),
    mode: 'onChange',
    defaultValues: async () => ({
      language: lng,
    }),
  });

  const createInviteTokenMutation = trpc.chat.createInviteToken.useMutation({
    onSuccess: (inviteToken) =>
      router.push(ROUTES.INVITE_CHAT_QR.pathname({ inviteToken }), {
        toSidePanel: hasSidePanel,
      }),
  });

  const languageOptions = Object.values(LANGUAGE).map((language) => ({
    label: t(language),
    value: language,
  }));

  return (
    <>
      <form
        className="mx-auto mb-2 flex w-full flex-col items-center gap-4"
        onSubmit={handleSubmit(async (params) => {
          assert(user);

          createInviteTokenMutation.mutate(params);
        })}
      >
        <label className="mb-10 w-full text-sm font-semibold">
          {t('friend-language')}
          <Controller
            control={control}
            name="language"
            render={({ field }) => (
              <Select
                className="mt-2"
                value={field.value}
                options={languageOptions}
                onValueChange={(language) => field.onChange(language)}
              />
            )}
          />
        </label>
        <Button
          className="w-full"
          loading={
            formState.isSubmitting || createInviteTokenMutation.isPending
          }
          type="submit"
        >
          {t('invite-button')}
        </Button>
      </form>
    </>
  );
};
