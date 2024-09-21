'use client';

import { useState } from 'react';
import { useCookies } from 'react-cookie';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { COOKIES } from '@/constants/cookies-key';
import { LANGUAGE } from '@/constants/language';
import { SESSION } from '@/constants/storage-key';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { isEnumValue } from '@/utils';
import { Select, TextField } from '@radix-ui/themes';

const NICKNAME_FIELD = 'nickname';

export const InviteForm = () => {
  const [cookies, setCookies] = useCookies([
    COOKIES.LAST_FRIEND_INDEX,
    COOKIES.LAST_FRIEND_LANGUAGE,
    COOKIES.MY_EMOJI,
    COOKIES.USER_ID,
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
      action={(formData) => {
        setIsLoading(true);

        setTimeout(() => setIsLoading(false), 5_000);

        const nickname = formData.get(NICKNAME_FIELD) || defaultNickname;

        if (!nickname) throw new Error('Invalid form data');

        const qrInfo = {
          userId,
          language,
          nickname,
          emoji: cookies[COOKIES.MY_EMOJI],
        };

        sessionStorage.setItem(SESSION.QR_INFO, JSON.stringify(qrInfo));

        setTimeout(() => router.push(ROUTES.INVITE_CHAT_QR.pathname), 1_000);
      }}
      className="mx-auto flex w-full max-w-96 flex-1 flex-col items-center justify-center gap-5 p-4"
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
      <CustomButton loading={isLoading}>{t('invite-button')}</CustomButton>
    </form>
  );
};
