import { MESSAGE_TYPE, type PeerData } from '@/types/peer-data';

import { isEnumValue } from './isEnumValue';

export const isPeerData = (peerData: unknown): peerData is PeerData => {
  if (!peerData || typeof peerData !== 'object') return false;

  if (!('id' in peerData) || !('type' in peerData) || !('data' in peerData))
    return false;

  if (typeof peerData.id !== 'string' || typeof peerData.type !== 'string')
    return false;

  if (!isEnumValue(MESSAGE_TYPE, peerData.type)) return false;

  return true;
};
