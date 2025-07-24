import { useState } from "react";
import type { Route } from "./+types/socket";
import { useSocket } from "../hooks/useSocket";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Socket Demo - Briend" },
    { name: "description", content: "Bun WebSocket 데모 페이지" },
  ];
}

export default function SocketDemo() {
  const {
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
  } = useSocket();

  const [echoInput, setEchoInput] = useState("");
  const [broadcastInput, setBroadcastInput] = useState("");
  const [chatInput, setChatInput] = useState("");

  const handleEcho = () => {
    if (echoInput.trim()) {
      sendEcho(echoInput);
      setEchoInput("");
    }
  };

  const handleBroadcast = () => {
    if (broadcastInput.trim()) {
      sendBroadcast(broadcastInput);
      setBroadcastInput("");
    }
  };

  const handleChat = () => {
    if (chatInput.trim()) {
      sendChat(chatInput);
      setChatInput("");
    }
  };

  const getMessageStyle = (type: string) => {
    const baseStyle = "p-3 rounded-lg mb-2 border-l-4";
    
    switch (type) {
      case "connected":
        return `${baseStyle} bg-green-50 border-green-400 text-green-700`;
      case "echo":
        return `${baseStyle} bg-blue-50 border-blue-400 text-blue-700`;
      case "broadcast":
        return `${baseStyle} bg-purple-50 border-purple-400 text-purple-700`;
      case "chat":
        return `${baseStyle} bg-orange-50 border-orange-400 text-orange-700`;
      case "disconnect":
        return `${baseStyle} bg-red-50 border-red-400 text-red-700`;
      case "error":
        return `${baseStyle} bg-red-100 border-red-500 text-red-800`;
      default:
        return `${baseStyle} bg-gray-50 border-gray-400 text-gray-700`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🚀 Bun WebSocket 데모
          </h1>
          <p className="text-gray-600 mb-4">
            실시간 소켓 통신을 테스트해보세요!
          </p>
          
          {/* 연결 상태 */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="font-medium">
                {isConnected ? '연결됨' : '연결 안됨'}
              </span>
            </div>
            
            {clientId && (
              <div className="text-sm text-gray-600">
                클라이언트 ID: <code className="bg-gray-200 px-2 py-1 rounded">{clientId}</code>
              </div>
            )}
            
            <div className="flex gap-2 ml-auto">
              <button
                onClick={connect}
                disabled={isConnected}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                연결
              </button>
              <button
                onClick={disconnect}
                disabled={!isConnected}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                연결 해제
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>오류:</strong> {error}
            </div>
          )}
        </div>

        {/* 기능 테스트 섹션 */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* 에코 테스트 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">📢 에코 테스트</h3>
            <p className="text-gray-600 text-sm mb-4">
              서버에서 메시지를 그대로 돌려받습니다
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={echoInput}
                onChange={(e) => setEchoInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEcho()}
                placeholder="에코할 메시지 입력"
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                disabled={!isConnected}
              />
              <button
                onClick={handleEcho}
                disabled={!isConnected || !echoInput.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </div>
          </div>

          {/* 브로드캐스트 테스트 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">📡 브로드캐스트</h3>
            <p className="text-gray-600 text-sm mb-4">
              모든 연결된 클라이언트에게 메시지를 전송합니다
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={broadcastInput}
                onChange={(e) => setBroadcastInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBroadcast()}
                placeholder="브로드캐스트할 메시지"
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                disabled={!isConnected}
              />
              <button
                onClick={handleBroadcast}
                disabled={!isConnected || !broadcastInput.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </div>
          </div>

          {/* 채팅 테스트 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">💬 채팅</h3>
            <p className="text-gray-600 text-sm mb-4">
              실시간 채팅 메시지를 전송합니다
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                placeholder="채팅 메시지 입력"
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                disabled={!isConnected}
              />
              <button
                onClick={handleChat}
                disabled={!isConnected || !chatInput.trim()}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </div>
          </div>
        </div>

        {/* 메시지 로그 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">📋 메시지 로그</h3>
            <button
              onClick={clearMessages}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              로그 클리어
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                아직 메시지가 없습니다. 위에서 기능을 테스트해보세요!
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div key={index} className={getMessageStyle(msg.type)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm uppercase tracking-wide mb-1">
                          {msg.type}
                          {msg.from && (
                            <span className="ml-2 text-xs opacity-75">
                              from: {msg.from}
                            </span>
                          )}
                        </div>
                        <div className="text-sm">{msg.message}</div>
                      </div>
                      {msg.timestamp && (
                        <div className="text-xs opacity-75 ml-4 whitespace-nowrap">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 사용법 안내 */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">📖 사용법</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">개발 환경에서 실행:</h4>
              <code className="block bg-gray-100 p-2 rounded">
                npm run dev:full
              </code>
              <p className="mt-1">React Router dev 서버와 Bun 소켓 서버를 동시에 실행합니다.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">별도 실행:</h4>
              <code className="block bg-gray-100 p-2 rounded mb-1">
                npm run dev
              </code>
              <code className="block bg-gray-100 p-2 rounded">
                npm run dev:server
              </code>
              <p className="mt-1">각각 다른 터미널에서 실행할 수도 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}