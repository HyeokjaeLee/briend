// Common constants
export const SOCKET_EVENTS = {
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVED: 'message:received',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  USER_TYPING: 'user:typing',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
} as const;

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
} as const;

export const DEFAULT_PORT = 3030;