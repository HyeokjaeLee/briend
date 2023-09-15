import { hashCode } from './hashCode';

export const naming = {
  chattingChannel: (hostId: string, guestName: string) =>
    `${hostId}-${hashCode(guestName)}`,

  sendingEvent: (from: string, to: string) => `${from}-${to}`,
};
