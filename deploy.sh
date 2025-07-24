#!/bin/bash

# Briend 프로덕션 배포 스크립트 (Docker Compose 기반)

set -e

echo "🚀 Briend 프로덕션 배포 시작..."

# 환경변수 확인
if [[ ! -f ".env.production" ]]; then
    echo "❌ .env.production 파일이 필요합니다"
    echo "다음 변수들을 설정하세요:"
    echo "POSTGRES_PASSWORD=your_secure_password"
    echo "JWT_SECRET=your_jwt_secret"
    echo "SUPABASE_ANON_KEY=your_anon_key"
    echo "SUPABASE_SERVICE_KEY=your_service_key"
    exit 1
fi

# 기존 컨테이너 중지
echo "🛑 기존 서비스 중지 중..."
docker-compose -f docker-compose.prod.yml down

# 최신 이미지 빌드
echo "🔨 Docker 이미지 빌드 중..."
docker-compose -f docker-compose.prod.yml build

# 서비스 시작
echo "▶️  서비스 시작 중..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# 상태 확인
echo "📊 서비스 상태 확인 중..."
sleep 5
docker-compose -f docker-compose.prod.yml ps

echo "✅ 배포 완료!"
echo ""
echo "📱 서비스 접속 정보:"
echo "- Web App: http://localhost:3000"
echo "- Socket Server: http://localhost:3001"
echo "- Database: postgresql://localhost:54322"
echo ""
echo "📝 로그 확인: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 서비스 중지: docker-compose -f docker-compose.prod.yml down"