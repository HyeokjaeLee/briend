'use client';

import dynamic from 'next/dynamic';

import { chattingRoomTable } from '@/stores/chatting-db.';
import { createOnlyClientComponent } from '@/utils/createOnlyClientComponent';
import { useSuspenseQuery } from '@tanstack/react-query';
interface ChattingRoomTemplateProps {
  channelId: string;
}

export const ChattingRoomTemplate = createOnlyClientComponent(
  ({ channelId }: ChattingRoomTemplateProps) => {
    const test = useSuspenseQuery({
      queryKey: ['chattingRoom', channelId],
      queryFn: () => chattingRoomTable.get(channelId),
    });

    console.log(test.data);

    return null;
  },
);
