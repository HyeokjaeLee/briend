# Docker 사용 가이드

## 🚀 개발 환경

### 스크립트 명령어
```bash
# 개발 컨테이너 실행 (hot reload 지원)
bun docker:dev

# 개발 이미지 빌드
bun docker:dev:build

# 개발 이미지 재빌드 (캐시 없이)
bun docker:dev:rebuild

# 개발 컨테이너 중지
bun docker:dev:stop

# 개발 컨테이너 중지 + 이미지 삭제
bun docker:dev:clean
```

### 수동 실행
```bash
# 개발 환경 빌드
docker build -f Dockerfile.dev -t briend-dev:latest .

# 개발 환경 실행 (볼륨 마운트로 hot reload)
docker run --rm -p 3000:3000 -p 8080:8080 \
  -v "$(pwd)":/app \
  -v /app/node_modules \
  -v /app/apps/web/node_modules \
  --name briend-dev-container \
  briend-dev:latest
```

## 🏗️ 프로덕션 환경

### 스크립트 명령어
```bash
# 프로덕션 이미지 빌드
bun docker:prod:build

# 프로덕션 컨테이너 실행
bun docker:prod:run
```

### 수동 실행
```bash
# 프로덕션 환경 빌드
docker build -f Dockerfile -t briend:latest .

# 프로덕션 환경 실행
docker run --rm -p 3000:3000 --name briend-prod-container briend:latest
```

## 📝 주요 특징

### 개발 환경 (Dockerfile.dev)
- **Hot Reload**: 코드 변경 시 자동 재시작
- **볼륨 마운트**: 로컬 파일과 실시간 동기화
- **포트**: 3000 (Next.js), 8080 (Socket Server 예정)
- **Vercel CLI**: 환경변수 자동 pull 지원

### 프로덕션 환경 (Dockerfile)
- **Multi-stage Build**: 최적화된 이미지 크기
- **PM2**: 프로세스 관리 및 클러스터 모드
- **Health Check**: 컨테이너 상태 모니터링
- **보안**: Non-root 사용자로 실행

## 🔧 트러블슈팅

### 포트 충돌
```bash
# 기존 프로세스 종료
bun kill:ports

# 또는 수동으로
lsof -ti:3000 | xargs kill -9
```

### 캐시 문제
```bash
# Docker 시스템 전체 정리
docker system prune -af

# 개발 이미지만 재빌드
bun docker:dev:rebuild
```

### 볼륨 권한 문제
```bash
# 컨테이너 내부에서 파일 소유권 확인
docker exec -it briend-dev-container ls -la /app
```

## 📦 환경 변수

개발 시에는 `.env.local` 파일을 생성하거나 `bun update:env` 로 Vercel에서 환경변수를 가져올 수 있습니다.

```bash
# Vercel 환경변수 가져오기
bun update:env

# 또는 .env.local 파일 생성
cp .env.example .env.local
```