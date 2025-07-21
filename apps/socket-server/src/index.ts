import { DEFAULT_PORT, SOCKET_EVENTS } from '@briend/common';
import type { SocketEvents, Message, User } from '@briend/common';
import { createId } from '@briend/common';

interface ConnectedClient {
  ws: ServerWebSocket;
  userId?: string;
  rooms: Set<string>;
}

class SocketServer {
  private clients = new Map<string, ConnectedClient>();
  private rooms = new Map<string, Set<string>>(); // roomId -> Set of clientIds
  
  constructor(private port: number = DEFAULT_PORT) {}

  start() {
    const server = Bun.serve({
      port: this.port,
      fetch: this.handleFetch.bind(this),
      websocket: {
        open: this.handleConnection.bind(this),
        message: this.handleMessage.bind(this),
        close: this.handleDisconnection.bind(this),
      },
    });

    console.log(`🚀 Socket server running on http://localhost:${server.port}`);
  }

  private handleFetch(req: Request): Response | Promise<Response> {
    const url = new URL(req.url);
    
    if (url.pathname === '/ws') {
      // Upgrade to WebSocket will be handled by Bun automatically
      return new Response('Upgrade to WebSocket', { status: 101 });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        clients: this.clients.size,
        rooms: this.rooms.size 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Socket Server', { status: 200 });
  }

  private handleConnection(ws: ServerWebSocket) {
    const clientId = createId();
    const client: ConnectedClient = {
      ws,
      rooms: new Set(),
    };
    
    this.clients.set(clientId, client);
    ws.data = { clientId };
    console.log(`Client connected: ${clientId}`);
  }

  private handleMessage(ws: ServerWebSocket, message: string | Buffer) {
    try {
      const data = JSON.parse(message.toString());
      const clientId = ws.data?.clientId;
      
      if (!clientId) return;
      
      this.processMessage(clientId, data);
    } catch (error) {
      console.error('Message parsing error:', error);
    }
  }

  private handleDisconnection(ws: ServerWebSocket) {
    const clientId = ws.data?.clientId;
    if (clientId) {
      const client = this.clients.get(clientId);
      if (client) {
        // Leave all rooms
        client.rooms.forEach(roomId => {
          this.leaveRoom(clientId, roomId);
        });
      }
      
      this.clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    }
  }

  private processMessage(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (data.type) {
      case SOCKET_EVENTS.MESSAGE_SEND:
        this.handleMessageSend(clientId, data.payload);
        break;
      case SOCKET_EVENTS.ROOM_JOIN:
        this.joinRoom(clientId, data.payload.roomId);
        break;
      case SOCKET_EVENTS.ROOM_LEAVE:
        this.leaveRoom(clientId, data.payload.roomId);
        break;
      case SOCKET_EVENTS.USER_TYPING:
        this.handleUserTyping(clientId, data.payload);
        break;
      case 'user:identify':
        this.identifyUser(clientId, data.payload.userId);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  private handleMessageSend(clientId: string, payload: any) {
    const { roomId, message } = payload;
    const newMessage: Message = {
      id: createId(),
      userId: message.userId,
      content: message.content,
      type: message.type,
      timestamp: Date.now(),
    };

    // Broadcast to all clients in the room
    this.broadcastToRoom(roomId, {
      type: SOCKET_EVENTS.MESSAGE_RECEIVED,
      payload: { message: newMessage },
    });
  }

  private joinRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.rooms.add(roomId);
    
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    
    this.rooms.get(roomId)!.add(clientId);
    console.log(`Client ${clientId} joined room ${roomId}`);
  }

  private leaveRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId);
    if (client) {
      client.rooms.delete(roomId);
    }
    
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }
    
    console.log(`Client ${clientId} left room ${roomId}`);
  }

  private handleUserTyping(clientId: string, payload: any) {
    const { roomId, userId } = payload;
    
    this.broadcastToRoom(roomId, {
      type: SOCKET_EVENTS.USER_TYPING,
      payload: { roomId, userId },
    }, [clientId]); // Exclude the sender
  }

  private identifyUser(clientId: string, userId: string) {
    const client = this.clients.get(clientId);
    if (client) {
      client.userId = userId;
      console.log(`Client ${clientId} identified as user ${userId}`);
    }
  }

  private broadcastToRoom(roomId: string, message: any, exclude: string[] = []) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.forEach(clientId => {
      if (exclude.includes(clientId)) return;
      
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === 1) { // WebSocket.OPEN
        client.ws.send(JSON.stringify(message));
      }
    });
  }
}

// Start the server
const socketServer = new SocketServer();
socketServer.start();