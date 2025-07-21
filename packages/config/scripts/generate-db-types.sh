#!/bin/bash

# 로그인 상태 확인
if ! supabase projects list > /dev/null 2>&1; then
  YELLOW='\033[0;33m'
  NC='\033[0m' # No Color
  echo "오류: Supabase CLI에 로그인되어 있지 않습니다."
  echo -e "다음 명령어를 실행하여 인증해주세요: ${YELLOW}bun run supabase:login${NC}"
  echo -e "또는 ${YELLOW}SUPABASE_ACCESS_TOKEN${NC} 환경 변수를 사용하여 액세스 토큰을 제공할 수 있습니다."
  exit 1
fi

# 로그인된 경우 타입 생성 진행
echo "Supabase 로그인이 확인되었습니다. 타입 생성을 시작합니다..."
bun run db:types:gen
