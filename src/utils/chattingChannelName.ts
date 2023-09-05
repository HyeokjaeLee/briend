import { stringToUnicode } from './stringToUnicode';

export interface ChattingChannelNameParams {
  hostId: string;
  guestName: string;
}

export const chattingChannelName = ({
  hostId,
  guestName,
}: ChattingChannelNameParams) =>
  `chatting-channel-${hostId}-${stringToUnicode(guestName)}`;
