# Doppler CLI 환경변수 관리 설정

## 설정 완료 사항
- Doppler CLI 설치 완료
- `apps/web/package.json`에 Doppler 스크립트 추가
- `apps/web/doppler.yaml` 프로젝트 설정 파일 생성
- `.gitignore`에 Doppler 파일들 추가

## 핵심 스크립트 명령어
```bash
npm run doppler:login     # Doppler 로그인
npm run doppler:setup     # 프로젝트 설정  
npm run env:push          # 로컬 → Doppler 업로드
npm run env:pull          # Doppler → 로컬 다운로드
npm run env:sync          # 양방향 동기화

npm run dev              # development 환경으로 실행
npm run dev:prod         # production 환경으로 실행
npm run dev:local        # .env.local 파일 사용
```

## 환경 구성
- **development**: 로컬 Supabase 개발환경
- **production**: Oracle Cloud 프로덕션 환경

## 다음 단계 (사용자가 수행)
1. `doppler login` 실행하여 계정 인증
2. 개발환경 설정을 Doppler에 업로드
3. 팀원들과 환경변수 공유 설정

## 생성된 파일
- `apps/web/doppler.yaml` - Doppler 프로젝트 설정
- `apps/web/README-Doppler.md` - 사용 가이드
- `.gitignore` 업데이트 (Doppler 파일 제외)