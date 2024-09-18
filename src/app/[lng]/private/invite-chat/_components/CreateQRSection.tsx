'use client';

import { nanoid } from 'nanoid';

import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

import { QR } from '@/components/QR';
import { COOKIES } from '@/constants/cookies-key';
import { LANGUAGE } from '@/constants/language';
import { API_ROUTES } from '@/routes/api';
import { Select, Skeleton, TextField } from '@radix-ui/themes';

export const CreateQRSection = () => {
  const [cookies, setCookies] = useCookies([
    COOKIES.LAST_FRIEND_INDEX,
    COOKIES.LAST_FRIEND_LANGUAGE,
    COOKIES.MY_EMOJI,
    COOKIES.USER_ID,
  ]);

  const [nickname, setNickname] = useState(
    `Friend ${cookies['last-friend-index'] ?? 0}`,
  );

  const userId = cookies[COOKIES.USER_ID];

  if (!userId && typeof window !== 'undefined')
    throw new Error('User ID is not found');

  const inviteUrl = API_ROUTES.INVITE_CHAT.url({
    searchParams: {
      emoji: cookies[COOKIES.MY_EMOJI] ?? '',
      language: cookies[COOKIES.LAST_FRIEND_LANGUAGE] ?? LANGUAGE.ENGLISH,
      nickname,
      'chat-id': nanoid(),
      'user-id': userId,
    },
  });

  const { t } = useTranslation('language-label');

  return (
    <section className="mx-auto flex w-full max-w-96 flex-col items-center gap-4 p-4">
      <Skeleton loading>
        <QR className="mb-11 size-40" href={inviteUrl.toString()} />
      </Skeleton>
      <Select.Root
        size="3"
        value={cookies[COOKIES.LAST_FRIEND_LANGUAGE] ?? LANGUAGE.ENGLISH}
        onValueChange={(language) =>
          setCookies(COOKIES.LAST_FRIEND_LANGUAGE, language)
        }
      >
        <Select.Trigger className="w-full" />
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
      <TextField.Root
        className="w-full"
        size="3"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
    </section>
  );
};
