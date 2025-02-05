'use client';

import type { z } from 'zod';

import { Controller, useForm } from 'react-hook-form';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import { CustomButton } from '@/components';
import { LANGUAGE } from '@/constants';
import { useCustomRouter, useLanguage, useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { createInviteTokenSchema } from '@/schema/trpc/chat';
import { useGlobalStore } from '@/stores';
import { assert, assertEnum } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from '@radix-ui/themes';

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
    onSuccess: ({ inviteToken }) =>
      router.push(ROUTES.INVITE_CHAT_QR.pathname({ inviteToken }), {
        toSidePanel: hasSidePanel,
      }),
  });

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
                        {t(language)}
                      </Select.Item>
                    );
                  })}
                </Select.Content>
              </Select.Root>
            )}
          />
        </label>
        <CustomButton
          className="w-full"
          loading={
            formState.isSubmitting || createInviteTokenMutation.isPending
          }
          type="submit"
        >
          {t('invite-button')}
        </CustomButton>
      </form>
    </>
  );
};
