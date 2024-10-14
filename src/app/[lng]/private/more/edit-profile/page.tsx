'use client';

import { useSession } from 'next-auth/react';
import { random } from 'node-emoji';

import { useEffect, useReducer, useState } from 'react';
import { BiRefresh } from 'react-icons/bi';

import { useTranslation } from '@/app/i18n/client';
import { CustomBottomNav } from '@/components/CustomBottomNav';
import { CustomButton } from '@/components/CustomButton';
import { CustomIconButton } from '@/components/CustomIconButton';
import { cn } from '@/utils/cn';
import { Skeleton, TextField } from '@radix-ui/themes';

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

const EditProfilePage = () => {
  const session = useSession();

  const user = session.data?.user;

  const [randomEmojiList, dispatchRandomEmojiList] = useReducer(
    () => createRandomEmojiList(),
    [],
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string>();

  const hasRandomEmojiList = !!randomEmojiList.length;

  useEffect(() => {
    if (!user) return;

    setSelectedEmoji(user.emoji);
    if (!hasRandomEmojiList) {
      dispatchRandomEmojiList();
    }
  }, [user, hasRandomEmojiList]);

  const { t } = useTranslation('more');

  return (
    <article className="flex-col gap-8 p-4 flex-center">
      <section className="w-full flex-col gap-8 flex-center">
        <Skeleton className="size-36 rounded-full" loading={!selectedEmoji}>
          <div className="flex size-36 select-none items-center justify-center rounded-full bg-slate-350 text-8xl">
            {selectedEmoji}
          </div>
        </Skeleton>

        <Skeleton className="h-32 w-full" loading={!randomEmojiList.length}>
          <ul className="w-full flex-wrap gap-5 rounded-xl bg-slate-830 p-5 flex-center">
            {randomEmojiList.map((emoji) => (
              <li key={emoji} className="relative">
                <CustomIconButton
                  className={cn('text-3xl', {
                    'bg-slate-350': selectedEmoji === emoji,
                  })}
                  variant="ghost"
                  onClick={() => {
                    setSelectedEmoji(emoji);
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
        <BiRefresh className="size-7" />
        {t('change-random-emoji')}
      </CustomButton>
      <label className="w-full">
        {t('my-nickname')}
        <TextField.Root
          className="mt-2 h-14 w-full rounded-xl px-1"
          placeholder={user?.name}
          size="3"
          variant="soft"
        />
      </label>
      <CustomBottomNav>
        <CustomButton className="w-full">저장하기</CustomButton>
      </CustomBottomNav>
    </article>
  );
};

export default EditProfilePage;
