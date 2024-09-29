'use client';

import { useState } from 'react';
import { useCookies } from 'react-cookie';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { COOKIES } from '@/constants/cookies-key';
import { LANGUAGE } from '@/constants/language';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { API_ROUTES } from '@/routes/api';
import { ROUTES } from '@/routes/client';
import { isEnumValue } from '@/utils';
import { Select, TextField } from '@radix-ui/themes';

const NICKNAME_FIELD = 'nickname';

export interface QrInfo {
  userId: string;
  language: LANGUAGE;
  nickname: string;
  emoji: string;
  expires: string;
}

export const InviteForm = () => {
  const [cookies, setCookies] = useCookies([
    COOKIES.LAST_FRIEND_INDEX,
    COOKIES.LAST_FRIEND_LANGUAGE,
    COOKIES.MY_EMOJI,
    COOKIES.USER_ID,
    COOKIES.QR_INFO,
    COOKIES.NICKNAME,
  ]);

  const userId = cookies[COOKIES.USER_ID];

  if (!userId && typeof window !== 'undefined')
    throw new Error('User is not found');

  const defaultNickname = `Friend ${cookies[COOKIES.LAST_FRIEND_INDEX] ?? 0}`;

  const language: LANGUAGE =
    cookies[COOKIES.LAST_FRIEND_LANGUAGE] ?? LANGUAGE.ENGLISH;

  const { t } = useTranslation('invite-chat');

  const router = useCustomRouter();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      action={async (formData) => {
        setIsLoading(true);

        setTimeout(() => setIsLoading(false), 5_000);

        const nickname = formData.get(NICKNAME_FIELD) || defaultNickname;

        if (typeof nickname !== 'string') throw new Error('Invalid form data');

        const {
          data: { inviteToken },
        } = await API_ROUTES.CREATE_CHAT({
          userId,
          language,
          nickname,
          emoji: cookies[COOKIES.MY_EMOJI],
        });

        router.push(
          ROUTES.INVITE_CHAT_QR.pathname({
            inviteToken,
          }),
        );
      }}
      className="mx-auto flex w-full flex-col items-center gap-5 p-4"
    >
      <div className="flex w-full flex-col gap-2">
        <label className="font-medium">🌍 {t('friend-language')}</label>
        <Select.Root
          size="3"
          value={language}
          onValueChange={(value) => {
            if (!isEnumValue(LANGUAGE, value))
              throw new Error('Language is not found');

            setCookies(COOKIES.LAST_FRIEND_LANGUAGE, value);
          }}
        >
          <Select.Trigger className="w-full" variant="soft" />
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
      </div>
      <label className="flex w-full flex-col gap-2 font-medium">
        🏷️ {t('friend-nickname')}
        <TextField.Root
          className="w-full"
          name={NICKNAME_FIELD}
          placeholder={defaultNickname}
          size="3"
          variant="soft"
        />
      </label>
      <CustomButton className="mt-12 w-full" loading={isLoading} size="4">
        {t('invite-button')}
      </CustomButton>
    </form>
  );
};
