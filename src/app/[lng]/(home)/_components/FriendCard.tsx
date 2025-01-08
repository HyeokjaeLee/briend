import type { CustomLinkProps } from '@/components';
import { CustomLink, ProfileImage } from '@/components';
import { ConnectionIndicator } from '@/components/molecules/ConnectionIndicator';
import { useProfileImage } from '@/hooks';
import { usePeerStore } from '@/stores';

interface FriendCardProps extends Pick<CustomLinkProps, 'href'> {
  friendUserId: string;
  nickname: string;
  href: string;
}

export const FriendCard = ({
  friendUserId,
  nickname,
  href,
}: FriendCardProps) => {
  const friendPeer = usePeerStore((state) =>
    state.friendConnections.data.get(friendUserId),
  );

  const { profileImageSrc } = useProfileImage(friendUserId);

  return (
    <CustomLink replace className="block px-5 py-3" href={href}>
      <article className="flex gap-3">
        <ProfileImage size="5" src={profileImageSrc} />
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <strong>{nickname}</strong>
            <p>마지막 메시지</p>
          </div>
          <div className="mb-auto">
            <ConnectionIndicator friendPeer={friendPeer} />
          </div>
        </div>
      </article>
    </CustomLink>
  );
};
