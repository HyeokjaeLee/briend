import { ChattingSide } from '@/app/[lng]/chatting/[userId]/side';
import { InviteChatQRSide } from '@/app/[lng]/private/invite-chat/[inviteToken]/side';
import { useSidePanel } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { assert, CustomError } from '@/utils';

import EmptyTemplate from './Empty';

interface ContentTemplateProps {
  sidePanelUrl: string;
  routeName: string;
}

export const SideContents = ({
  sidePanelUrl,
  routeName,
}: ContentTemplateProps) => {
  const sidePanel = useSidePanel();

  try {
    switch (routeName) {
      case 'FRIEND_LIST':
        return <EmptyTemplate />;

      case 'CHATTING_ROOM': {
        const userId = sidePanelUrl.split('/')[3]?.split('?')[0];

        assert(userId);

        return <ChattingSide userId={userId} />;
      }

      case 'INVITE_CHAT_QR': {
        const inviteToken = sidePanelUrl.split('/')[4];

        assert(inviteToken);

        return <InviteChatQRSide inviteToken={inviteToken} />;
      }

      default:
        throw new CustomError('Invalid Side Panel Route');
    }
  } catch {
    sidePanel.push(ROUTES.FRIEND_LIST.pathname);
  }
};
