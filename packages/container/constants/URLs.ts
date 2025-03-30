import Constants from "expo-constants";
import { Platform } from "react-native";

// 개발 환경에서 사용할 IP 주소
// 로컬 개발환경에서는 실제 기기가 접근 가능한 IP 주소 필요
// 참고: localhost는 기기 자신을 가리키므로 사용 불가

// Expo 개발 도구에서 제공하는 Local LAN URL 정보를 추출하여 자동으로 IP 사용
const getDevServerIP = () => {
  if (Constants.expoConfig?.hostUri) {
    // hostUri 형식: "192.168.0.123:8081"
    const ipMatch = Constants.expoConfig.hostUri.match(/(\d+\.\d+\.\d+\.\d+)/);
    return ipMatch ? ipMatch[1] : null;
  }
  return null;
};

// 개발 서버 IP - 자동 감지 실패 시 대체할 IP 주소를 실제 개발 환경에 맞게 설정하세요
const DEV_SERVER_IP = getDevServerIP() || "192.168.0.1"; // 기본값으로 대체
const DEV_WEB_PORT = "3000"; // Next.js 기본 포트

// 개발 환경에서는 로컬 서버를, 그 외에는 배포된 URL을 사용
// 배포된 URL을 기본값으로 사용하여 웹뷰가 항상 내용을 표시하도록 함
const FALLBACK_URL = "https://briend.vercel.app";

// URL 상수
export const URLS = {
  // 웹앱 URL - 개발 환경에서 로컬 URL에 접근할 수 없으면 배포된 URL을 사용
  WEB_APP: __DEV__ ? `http://localhost:${DEV_WEB_PORT}` : FALLBACK_URL,

  // API URL
  API: __DEV__ ? `http://localhost:${DEV_WEB_PORT}/api` : `${FALLBACK_URL}/api`,
};

// 웹뷰 내에서 특수하게 처리할 URL 패턴 (예: 외부 브라우저로 열기)
export const URL_PATTERNS = {
  EXTERNAL: [
    "https://accounts.google.com", // 구글 로그인
    "https://appleid.apple.com", // 애플 로그인
  ],
};

// 개발 환경에서의 URL이 잘못되었을 때 쉽게 문제를 파악할 수 있도록 디버그 정보 추가
console.log("웹뷰 URL:", URLS.WEB_APP);
