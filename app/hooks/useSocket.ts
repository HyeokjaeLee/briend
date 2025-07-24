import { useEffect, useRef, useState, useCallback } from "react";

interface SocketMessage {
  type: string;
  message: string;
  from?: string;
  clientId?: string;
  timestamp?: string;
  messageId?: number;
}

interface UseSocketOptions {
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const {
    autoConnect = true,
    reconnectAttempts = 3,
    reconnectDelay = 1000
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // WebSocket은 항상 3001 포트 사용
      const socketUrl = 'ws://localhost:3001/ws';
        
      ws.current = new WebSocket(socketUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectCount.current = 0;
        console.log('소켓 연결 성공');
      };

      ws.current.onmessage = (event) => {
        try {
          const data: SocketMessage = JSON.parse(event.data);
          
          if (data.type === 'connected' && data.clientId) {
            setClientId(data.clientId);
          }
          
          setMessages(prev => [...prev, data]);
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        
        // 자동 재연결 시도
        if (reconnectCount.current < reconnectAttempts) {
          reconnectCount.current++;
          console.log(`재연결 시도 ${reconnectCount.current}/${reconnectAttempts}`);
          
          reconnectTimer.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else {
          setError('소켓 연결에 실패했습니다');
        }
      };

      ws.current.onerror = (error) => {
        console.error('소켓 오류:', error);
        setError('소켓 연결 오류가 발생했습니다');
      };
    } catch (error) {
      setError('소켓 연결을 시작할 수 없습니다');
    }
  }, [reconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setIsConnected(false);
    setClientId(null);
  }, []);

  const sendMessage = useCallback((type: string, message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, message }));
      return true;
    }
    
    setError('소켓이 연결되지 않았습니다');
    return false;
  }, []);

  const sendEcho = useCallback((message: string) => {
    return sendMessage('echo', message);
  }, [sendMessage]);

  const sendBroadcast = useCallback((message: string) => {
    return sendMessage('broadcast', message);
  }, [sendMessage]);

  const sendChat = useCallback((message: string) => {
    return sendMessage('chat', message);
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    messages,
    error,
    clientId,
    connect,
    disconnect,
    sendEcho,
    sendBroadcast,
    sendChat,
    clearMessages
  };
};