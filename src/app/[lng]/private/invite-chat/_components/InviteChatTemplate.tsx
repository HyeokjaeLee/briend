'use client';

import { useState } from 'react';
import { useCookies } from 'react-cookie';

import { COOKIES } from '@/constants/cookies-key';
import { LANGUAGE } from '@/constants/language';

import { CreateQRSection } from './CreateQRSection';
import { FriendSection } from './FriendSection';

export const InviteChatTemplate = () => {
  const [cookies, setCookies] = useCookies([
    COOKIES.LAST_FRIEND_INDEX,
    COOKIES.LAST_FRIEND_LANGUAGE,
    COOKIES.MY_EMOJI,
    COOKIES.USER_ID,
  ]);

  const userId = cookies[COOKIES.USER_ID];

  if (!userId && typeof window !== 'undefined')
    throw new Error('User ID is not found');

  const defaultNickname = `Friend ${cookies['last-friend-index'] ?? 0}`;
  const [nickname, setNickname] = useState('');
  const language: LANGUAGE =
    cookies[COOKIES.LAST_FRIEND_LANGUAGE] ?? LANGUAGE.ENGLISH;

  return (
    <article className="flex flex-1 flex-col">
      <FriendSection
        emoji={cookies[COOKIES.MY_EMOJI] ?? ''}
        language={language}
        nickname={nickname || defaultNickname}
        userId={userId}
      />
      <hr />
      <CreateQRSection
        language={language}
        nickname={nickname}
        nicknamePlaceholder={defaultNickname}
        onChangeLanguage={(lng) =>
          setCookies(COOKIES.LAST_FRIEND_LANGUAGE, lng)
        }
        onChangeNickname={setNickname}
      />
    </article>
  );
};
