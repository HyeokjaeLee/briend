# Doppler CLI 사용 가이드

## 초기 설정

### 1. Doppler 로그인
```bash
bun run doppler:login
# 또는
doppler login
```

### 2. 프로젝트 설정
```bash
cd apps/web
bun run doppler:setup
# 또는  
doppler setup --project briend --config dev
```

## 환경변수 관리

### 개발환경 설정 업로드
```bash
bun run env:push
# 또는
doppler secrets upload .env.development --config dev
```

### 환경변수 다운로드
```bash  
bun run env:pull
# 또는
doppler secrets download --no-file --format env --config dev > .env.local
```

### 환경변수 동기화
```bash
bun run env:sync
```

## 개발 서버 실행

### Doppler를 통한 실행 (권장)
```bash
bun run dev          # dev 환경으로 실행
bun run dev:prod     # production 환경으로 실행
```

### 로컬 파일로 실행
```bash
bun run dev:local    # .env.local 파일 사용
```

## 환경별 설정

### Development 환경
- Doppler config: `dev`  
- 로컬 Supabase 사용
- 디버그 모드 활성화

### Production 환경  
- Doppler config: `prd`
- Oracle Cloud Supabase 사용
- 프로덕션 최적화 설정

## Doppler 웹 콘솔
환경변수는 Doppler 웹 콘솔에서도 관리할 수 있습니다:
https://dashboard.doppler.com/

## 명령어 모음

| 명령어 | 설명 |
|--------|------|
| `bun run doppler:login` | Doppler 로그인 |
| `bun run doppler:setup` | 프로젝트 설정 |
| `bun run doppler:secrets` | 환경변수 목록 보기 |  
| `bun run env:push` | 로컬 → Doppler 업로드 |
| `bun run env:pull` | Doppler → 로컬 다운로드 |
| `bun run env:sync` | 양방향 동기화 |

## 보안 주의사항

1. `.env.local` 파일은 Git에 커밋하지 마세요
2. `.doppler.yaml` 설정 파일은 Git에 커밋하지 마세요  
3. 민감한 정보는 Doppler에서만 관리하세요
4. 로컬 개발시에만 `.env.development` 참조하세요