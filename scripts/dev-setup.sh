#!/bin/bash

# 로컬 개발 환경 설정 스크립트
set -e

echo "🛠️  Briend 로컬 개발 환경 설정을 시작합니다..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Bun 설치 확인
if ! command -v bun &> /dev/null; then
    print_status "Bun 설치 중..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
else
    print_status "Bun이 이미 설치되어 있습니다: $(bun --version)"
fi

# 의존성 설치
print_status "의존성 설치 중..."
bun install

# 타입 체크
print_status "타입 체크 수행 중..."
bun run typecheck

print_status "✅ 로컬 개발 환경 설정이 완료되었습니다!"
echo ""
echo "🚀 사용 가능한 명령어:"
echo "  - 개발 서버 시작: bun run dev"
echo "  - 프로덕션 빌드: bun run build"
echo "  - 프로덕션 실행: bun run start"
echo "  - 타입 체크: bun run typecheck"
echo ""
echo "📡 서버 포트:"
echo "  - React Router App: http://localhost:5173 (dev) / http://localhost:3000 (prod)"
echo "  - WebSocket Server: ws://localhost:3001/ws"