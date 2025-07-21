# Briend 아키텍처

## 모노레포 구조
```
briend/
├── apps/
│   ├── web/           # Next.js PWA 웹앱
│   ├── native/        # Expo React Native 앱
│   └── socket-server/ # Socket.io 실시간 서버
├── packages/
│   └── common/        # 공통 타입 및 유틸리티
└── turbo.json         # Turbo 설정
```

## 웹 애플리케이션 구조 (apps/web)
```
src/
├── app/                 # App Router (Next.js 13+)
│   ├── [lng]/          # 다국어 라우팅
│   │   ├── private/    # 인증 필요 페이지
│   │   ├── guest/      # 게스트 페이지
│   │   └── chatting/   # 채팅 관련 페이지
│   └── api/            # API 라우트
├── components/         # UI 컴포넌트
│   ├── atoms/          # 기본 컴포넌트
│   ├── molecules/      # 복합 컴포넌트
│   └── organisms/      # 복잡한 컴포넌트
├── configs/            # 설정 파일들
├── constants/          # 상수 정의
├── database/           # Firebase & IndexedDB
├── hooks/              # 커스텀 훅
├── stores/             # Zustand 상태 관리
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수들
```

## 라우팅 구조
- `/[lng]/`: 다국어 지원 (ko, en, ja, zh, vi, th)
- `/[lng]/private/`: 인증 필요 (친구 목록, 프로필 등)
- `/[lng]/guest/`: 게스트 접근 (로그인)
- `/[lng]/chatting/`: 채팅 기능 (join, [userId])

## 데이터 플로우
1. **사용자 인증**: NextAuth.js → Firebase Auth
2. **채팅방 생성**: QR 코드 생성 → JWT 토큰
3. **채팅 참여**: QR 스캔 → 토큰 검증 → 채팅방 입장
4. **메시지 송수신**: tRPC → 번역 API → Firebase → Socket.io
5. **데이터 저장**: 로컬 (IndexedDB) + 서버 (Firebase)

## 실시간 통신
- **Socket.io**: 메시지 실시간 전송
- **Firebase Realtime Database**: 사용자 상태 동기화
- **tRPC**: API 호출 및 상태 관리

## 공통 패키지 구조 (packages/common)
- `types.ts`: 공통 타입 정의 (User, Message, ChatRoom)
- `constants.ts`: 공통 상수 (소켓 이벤트, 포트 등)
- `utils.ts`: 공통 유틸리티 함수들