import { CustomLink, ProfileImage } from '@/components';
import { ConnectionIndicator } from '@/components/molecules/ConnectionIndicator';
import { Skeleton } from '@radix-ui/themes';

interface FriendCardProps {
  id: string;
  name: string;
  href: string;
  profileImage?: string;
}

export const FriendCard = ({
  id,
  name,
  href,
  profileImage,
}: FriendCardProps) => {
  return (
    <CustomLink
      replace
      className="block px-5 py-3"
      href={href ?? '#'}
      scroll={false}
      onClick={(e) => {
        if (!href) e.preventDefault();
      }}
    >
      <article className="flex gap-3">
        <ProfileImage size="5" src={profileImage} />
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <strong>{name}</strong>
            <p>마지막 메시지</p>
          </div>
          <div className="mb-auto">
            <ConnectionIndicator />
          </div>
        </div>
      </article>
    </CustomLink>
  );
};

export const FriendCardSkeleton = () => {
  return (
    <div className="flex gap-3 px-5 py-3">
      <Skeleton className="size-14 shrink-0 rounded-full" />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <Skeleton className="mb-1 h-5 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  );
};
