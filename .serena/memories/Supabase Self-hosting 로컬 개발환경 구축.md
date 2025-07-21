# Supabase Self-hosting 로컬 개발환경 구축

## 핵심 명령어

### Supabase 로컬 관리
```bash
# 로컬 Supabase 시작
supabase start

# 상태 확인  
supabase status

# DB 리셋 (마이그레이션 재적용)
supabase db reset

# 타입 생성
supabase gen types typescript --local > apps/web/src/database/database.types.ts

# 서비스 중지
supabase stop
```

### 로컬 접속 정보
- **API**: http://127.0.0.1:54321
- **Studio**: http://127.0.0.1:54323  
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Email Test**: http://127.0.0.1:54324

## 생성된 스키마
- users (사용자)
- chat_rooms (채팅방)
- chat_room_participants (참가자)  
- messages (메시지)
- social_accounts (소셜 로그인)
- translation_history (번역 기록)

## 마이그레이션 파일 위치
- `supabase/migrations/001_initial_schema.sql` - 초기 스키마
- `supabase/migrations/002_fix_rls_policies.sql` - RLS 수정

## 개발용 시드 데이터
- 테스트 사용자 3명 (dev_user1, dev_user2, dev_user3)
- 테스트 채팅방 3개 (일반 채팅, 개발 논의, 비밀 채팅)
- 샘플 메시지들