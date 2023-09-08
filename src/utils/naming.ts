import { stringToUnicode } from './stringToUnicode';

export const naming = {
  chattingChannel: (hostId: string, guestName: string) =>
    `chatting-channel-${hostId}-${stringToUnicode(guestName)}`,

  chattingTokenList: (userId: string) => `${userId}-chatting-rooms`,
};
