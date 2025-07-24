# Oracle Cloud 프로덕션 배포 준비

## 생성된 배포 스크립트
1. **oracle-cloud-setup.sh** - 서버 보안 설정 및 Supabase 설치
2. **migrate-to-self-hosted.sh** - 데이터 마이그레이션 자동화

## Oracle Cloud 무료 티어 스펙
- **VM**: ARM Ampere A1, 최대 4 OCPU, 24GB RAM
- **Storage**: 200GB Block Volume  
- **Network**: 10TB/월 아웃바운드
- **완전 무료**: 평생 사용 가능

## 보안 설정 포함사항
- UFW 방화벽 (기본 거부 정책)
- fail2ban SSH 보호
- Docker 보안 강화 설정
- SSL/TLS 인증서 (Let's Encrypt)
- Nginx 리버스 프록시
- 시스템 모니터링

## 배포 순서
1. Oracle Cloud VM 생성
2. `./oracle-cloud-setup.sh` 실행
3. DNS 설정 및 SSL 인증서 발급  
4. Supabase 서비스 시작
5. `./migrate-to-self-hosted.sh` 로 환경변수 업데이트

## 예상 성능 향상
- 현재 Cloud: 1GB RAM, 제한적 리소스
- 이후 Self-hosted: 24GB RAM, 전용 4코어, 무제한 DB