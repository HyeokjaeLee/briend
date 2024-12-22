import { useSession } from 'next-auth/react';

import { ProfileImage, CustomLink } from '@/components';
import { ROUTES } from '@/routes/client';
import {
  MEDIA_QUERY_BREAK_POINT,
  useGlobalStore,
  usePeerStore,
} from '@/stores';
import { cn } from '@/utils';
import { Avatar } from '@radix-ui/themes';

export const MyProfileCard = () => {
  const session = useSession();

  const user = session.data?.user;

  if (!user) return null;

  return (
    <CustomLink className="block px-5 py-3" href={ROUTES.EDIT_PROFILE.pathname}>
      <article className="flex gap-3">
        <ProfileImage />
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <strong>{nickname}</strong>
            <p>마지막 메시지</p>
          </div>
          <div className="mb-auto">ss</div>
        </div>
      </article>
    </CustomLink>
  );
};
