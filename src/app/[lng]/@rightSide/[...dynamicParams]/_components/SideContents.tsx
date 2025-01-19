import { memo } from 'react';

import { ChattingSide } from '@/app/[lng]/chatting/[userId]/side';
import { createOnlyClientComponent } from '@/utils/client';

import EmptyTemplate from './Empty';

interface ContentTemplateProps {
  sidePanelUrl: string;
  routeName: string;
}

const Contents = createOnlyClientComponent(
  ({ sidePanelUrl, routeName }: ContentTemplateProps) => {
    switch (routeName) {
      case 'CHATTING_ROOM': {
        const userId = sidePanelUrl.split('/')[3];

        return <ChattingSide userId={userId} />;
      }

      default:
        return <EmptyTemplate />;
    }
  },
  EmptyTemplate,
);

export const SideContents = memo(Contents);
