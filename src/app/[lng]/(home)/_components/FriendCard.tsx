import type { CustomLinkProps } from '@/components';
import { CustomLink, ProfileImage } from '@/components';
import { ConnectionIndicator } from '@/components/molecules/ConnectionIndicator';
import { Skeleton } from '@radix-ui/themes';

interface FriendCardProps {
  id?: string;
  name?: string;
  href?: string;
  profileImage?: string;
  loading?: boolean;
}

export const FriendCard = ({
  id,
  name,
  href,
  profileImage,
  loading = false,
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
        <Skeleton loading={loading}>
          <ProfileImage size="5" src={profileImage} />
        </Skeleton>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            {loading ? (
              <Skeleton className="mb-1 h-5 w-32" />
            ) : (
              <strong>{name}</strong>
            )}
            {loading ? <Skeleton className="h-4 w-64" /> : <p>마지막 메시지</p>}
          </div>
          <div className="mb-auto">
            <ConnectionIndicator />
          </div>
        </div>
      </article>
    </CustomLink>
  );
};
