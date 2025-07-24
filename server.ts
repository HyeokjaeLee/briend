import { serve } from "bun";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface SocketData {
  id: string;
}

const clients = new Map<string, any>();
let messageId = 0;

const server = serve<SocketData>({
  port: process.env.PORT || 3001,
  fetch(req, server) {
    const url = new URL(req.url);
    
    // WebSocket 업그레이드 처리
    if (url.pathname === "/ws") {
      const id = Math.random().toString(36).substring(7);
      const success = server.upgrade(req, {
        data: { id },
      });
      
      if (success) {
        return undefined;
      }
      
      return new Response("WebSocket upgrade failed", { status: 400 });
    }
    
    // API 라우트 처리
    if (url.pathname.startsWith("/api")) {
      return handleApi(req);
    }
    
    // 정적 파일 서빙 (React Router 빌드 파일)
    return serveStatic(url.pathname);
  },
  
  websocket: {
    open(ws) {
      const { id } = ws.data;
      clients.set(id, ws);
      console.log(`클라이언트 연결: ${id}`);
      
      // 연결 확인 메시지 전송
      ws.send(JSON.stringify({
        type: "connected",
        message: "소켓 서버에 연결되었습니다!",
        clientId: id
      }));
    },
    
    message(ws, message) {
      const { id } = ws.data;
      let data;
      
      try {
        data = JSON.parse(message as string);
      } catch (e) {
        ws.send(JSON.stringify({
          type: "error",
          message: "잘못된 JSON 형식입니다"
        }));
        return;
      }
      
      console.log(`클라이언트 ${id}로부터 메시지:`, data);
      
      // 메시지 타입에 따른 처리
      switch (data.type) {
        case "echo":
          ws.send(JSON.stringify({
            type: "echo",
            message: `에코: ${data.message}`,
            messageId: ++messageId
          }));
          break;
          
        case "broadcast":
          // 모든 클라이언트에게 브로드캐스트
          const broadcastMessage = JSON.stringify({
            type: "broadcast",
            message: data.message,
            from: id,
            messageId: ++messageId
          });
          
          clients.forEach((client, clientId) => {
            client.send(broadcastMessage);
          });
          break;
          
        case "chat":
          // 채팅 메시지 처리
          const chatMessage = JSON.stringify({
            type: "chat",
            message: data.message,
            from: id,
            timestamp: new Date().toISOString(),
            messageId: ++messageId
          });
          
          clients.forEach((client) => {
            client.send(chatMessage);
          });
          break;
          
        default:
          ws.send(JSON.stringify({
            type: "error",
            message: "알 수 없는 메시지 타입입니다"
          }));
      }
    },
    
    close(ws) {
      const { id } = ws.data;
      clients.delete(id);
      console.log(`클라이언트 연결 해제: ${id}`);
      
      // 다른 클라이언트들에게 연결 해제 알림
      const disconnectMessage = JSON.stringify({
        type: "disconnect",
        message: `클라이언트 ${id}가 연결을 해제했습니다`,
        clientId: id
      });
      
      clients.forEach((client) => {
        client.send(disconnectMessage);
      });
    }
  }
});

// API 핸들러
function handleApi(req: Request): Response {
  const url = new URL(req.url);
  
  if (url.pathname === "/api/status") {
    return new Response(JSON.stringify({
      status: "running",
      clients: clients.size,
      messages: messageId
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  
  return new Response("Not Found", { status: 404 });
}

// 정적 파일 서빙
function serveStatic(pathname: string): Response {
  // 개발환경에서는 React Router dev 서버로 프록시
  if (process.env.NODE_ENV !== "production") {
    return fetch(`http://localhost:5173${pathname}`).catch(() => {
      return new Response(`<!DOCTYPE html>
<html>
<head>
  <title>Briend Socket Server</title>
</head>
<body>
  <h1>Briend Socket Server</h1>
  <p>React Router dev 서버가 실행되지 않았습니다.</p>
  <p>다른 터미널에서 <code>bun run dev</code>를 실행해주세요.</p>
</body>
</html>`, {
        headers: { "Content-Type": "text/html" }
      });
    });
  }
  
  // 프로덕션에서는 React Router SSR 사용
  // assets 파일들만 직접 서빙하고, 나머지는 SSR 처리가 필요
  if (pathname.startsWith("/assets/")) {
    const filePath = join(process.cwd(), "build/client", pathname);
    
    if (existsSync(filePath)) {
      const content = readFileSync(filePath);
      const ext = filePath.split(".").pop();
      const contentType = getContentType(ext || "");
      
      return new Response(content, {
        headers: { "Content-Type": contentType }
      });
    }
  }
  
  // favicon 처리
  if (pathname === "/favicon.ico") {
    const faviconPath = join(process.cwd(), "build/client/favicon.ico");
    if (existsSync(faviconPath)) {
      const content = readFileSync(faviconPath);
      return new Response(content, {
        headers: { "Content-Type": "image/x-icon" }
      });
    }
  }
  
  // 프로덕션에서는 React Router 내장 서버 사용 권장
  return new Response(`<!DOCTYPE html>
<html>
<head>
  <title>Briend Socket Server</title>
</head>
<body>
  <h1>🚀 Briend Socket Server</h1>
  <p>프로덕션 모드에서는 <code>bun run start</code> (React Router 서버)를 사용하세요.</p>
  <p>또는 <code>/socket</code> 경로에서 WebSocket 기능을 테스트할 수 있습니다.</p>
  <p>📡 WebSocket: <code>ws://localhost:${server?.port || 3001}/ws</code></p>
  <p>🔧 API: <code>/api/status</code></p>
</body>
</html>`, {
    headers: { "Content-Type": "text/html" }
  });
}

function getContentType(ext: string): string {
  const types: Record<string, string> = {
    html: "text/html",
    js: "application/javascript",
    css: "text/css",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml"
  };
  
  return types[ext] || "text/plain";
}

console.log(`🚀 Bun 소켓 서버가 http://localhost:${server.port}에서 실행 중입니다`);
console.log(`📡 WebSocket: ws://localhost:${server.port}/ws`);
console.log(`🔧 API: http://localhost:${server.port}/api/status`);