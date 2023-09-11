import { replace } from 'lodash-es';

import { stringToUnicode } from './stringToUnicode';

export const naming = {
  chattingChannel: (hostId: string, guestName: string) =>
    `chatting-channel-${hostId}-${replace(
      stringToUnicode(guestName),
      ' ',
      '',
    )}`,

  chattingTokenList: (userId: string) => `${userId}-chatting-rooms`,
};
