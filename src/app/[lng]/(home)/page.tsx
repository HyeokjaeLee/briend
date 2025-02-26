import { RiLinkUnlinkM, RiShieldCheckFill } from 'react-icons/ri';

import { getTranslation } from '@/configs/i18n/server';
import type { LANGUAGE } from '@/constants';

import { FriendList } from './_components/FriendList';
import { HomeHeader } from './_components/HomeHeader';

interface HomeProps {
  params: Promise<{
    lng: LANGUAGE;
  }>;
}

export default async function HomePage({ params }: HomeProps) {
  const { lng } = await params;

  const { t } = await getTranslation('friend-list', lng);

  return (
    <article className="flex min-h-full flex-col">
      <HomeHeader />
      <dl className="grid grid-cols-[1fr_auto] items-center justify-end gap-1 p-4 text-end text-xs text-gray-400">
        <dt>{t('identified-icon')}</dt>
        <dd>
          <RiShieldCheckFill className="size-3 text-green-500" />
        </dd>
        <dt>{t('unlinked-icon')}</dt>
        <dd>
          <RiLinkUnlinkM className="size-3 text-red-500" />
        </dd>
      </dl>
      <FriendList />
    </article>
  );
}
