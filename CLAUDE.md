# Briend 프로젝트 개발 규칙

## 기술 스택

### 백엔드 & 데이터베이스

- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth (소셜 로그인: 카카오, 구글, 네이버)
- **실시간 통신**: 자체 Socket 서버 (Bun 기반)
- **파일 저장소**: Supabase Storage
- **번역**: DeepL API (메인), Google Translate (백업)

### 프론트엔드

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **컴포넌트**: ShadcnUI
- **상태관리**: Zustand
- **API**: tRPC
- **PWA**: 네이티브 앱 경험 제공

### 모노레포 구조

```
briend/
├── apps/
│   ├── web/           # Next.js 15 PWA 웹앱
│   ├── native/        # Expo React Native 앱
│   └── socket-server/ # Bun 기반 Socket.io 실시간 서버
├── packages/
│   └── common/        # 공통 타입 및 유틸리티
└── turbo.json         # Turbo 설정
```

## 데이터베이스 스키마

### Supabase Tables

- **users**: 사용자 정보 (id, username, email, avatar)
- **chat_rooms**: 채팅방 (id, name, created_at)
- **chat_room_participants**: 채팅방 참가자 (room_id, user_id)
- **messages**: 메시지 (id, room_id, user_id, content, type, created_at)
- **provider_accounts**: 소셜 로그인 계정 연결

### Row Level Security (RLS)

- 모든 테이블에 RLS 정책 적용
- 사용자는 본인 데이터와 참여 중인 채팅방 데이터만 접근 가능

## 개발 규칙

### Firebase → Supabase 마이그레이션 완료

- ❌ Firebase Auth, Firestore, Realtime DB, Storage 사용 금지
- ✅ Supabase Auth, PostgreSQL, Socket 서버, Supabase Storage 사용
- ✅ 실시간 통신: Socket 서버 (메모리 기반) + Supabase (영구 저장)

### 실시간 채팅 아키텍처

- **Socket 서버**: 실시간 메시지 브로드캐스팅 (성능 우선)
- **Supabase**: 메시지 영구 저장 및 이력 관리
- **연결 시**: DB에서 최근 50개 메시지 로드
- **메시지 전송**: Socket으로 실시간 전송 + DB에 저장

### 인증 시스템

- Supabase Auth 사용
- 소셜 로그인: 카카오, 구글, 네이버
- 게스트 모드: 익명 로그인 지원
- JWT 토큰 기반 인증

### 번역 시스템

- DeepL API 우선 사용 (자연스러운 번역)
- Google Translate API 백업
- 지원 언어: 한국어, 영어, 일본어

### 패키지 관리

- **패키지 매니저**: Bun
- **모노레포**: Turbo
- **의존성**: package.json에 있는 것만 사용
- 새로운 라이브러리 추가 전 기존 사용 여부 확인 필수

### 파일 구조 (apps/web)

```
src/
├── app/                 # App Router
├── components/         # UI 컴포넌트 (atoms/molecules/organisms)
├── configs/            # 설정 파일들
├── database/           # Supabase 클라이언트
├── stores/             # Zustand 상태 관리
└── utils/              # 유틸리티 함수들
```

## 주의사항

### 보안

- 시크릿 키나 민감 정보 로그/커밋 금지
- RLS 정책으로 데이터 접근 제어
- 모든 API 엔드포인트에 인증 검증

### 성능

- Socket 서버는 메모리 기반 실시간 처리 유지
- 이미지 최적화 및 lazy loading 적용
- PWA 캐싱 전략 활용

### 테스트

- 통합 테스트 우선
- 실시간 기능 테스트 시 Socket 서버 연동 확인
- 번역 기능 테스트 시 API 할당량 고려

## 배포

- **Frontend**: Vercel
- **Socket Server**: 별도 서버 배포
- **Database**: Supabase 호스팅
- PWA 매니페스트 및 서비스 워커 포함

## 문제 해결

- 실시간 기능 이슈: Socket 서버 연결 상태 확인
- 번역 실패: 백업 API로 자동 전환
- 인증 문제: Supabase Auth 세션 상태 확인
- DB 접근 오류: RLS 정책 및 권한 확인

## Rule 업데이트 규칙

- 유저가 새로운 규칙 알려줬을 때 CLAUDE.md, GEMINI.md를 같은 내용으로 항상 최신화
