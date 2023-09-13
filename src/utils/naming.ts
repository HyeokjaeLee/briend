import { hashCode } from './hashCode';

export const naming = {
  chattingChannel: (hostId: string, guestName: string) =>
    `${hostId}-${hashCode(guestName)}`,
};
