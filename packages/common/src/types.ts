// Common types shared across projects
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'file';
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: User[];
  lastMessage?: Message;
  createdAt: number;
}

// Socket event types
export interface SocketEvents {
  'message:send': { roomId: string; message: Omit<Message, 'id' | 'timestamp'> };
  'message:received': { message: Message };
  'message:history': { roomId: string; messages: Message[] };
  'room:join': { roomId: string };
  'room:leave': { roomId: string };
  'user:typing': { roomId: string; userId: string };
  'user:online': { userId: string };
  'user:offline': { userId: string };
}