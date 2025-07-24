#!/bin/bash

# Briend 애플리케이션 관리 스크립트
set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

show_help() {
    echo "Briend 애플리케이션 관리 도구"
    echo ""
    echo "사용법: $0 [명령어]"
    echo ""
    echo "명령어:"
    echo "  status    - 서비스 상태 확인"
    echo "  start     - 서비스 시작"
    echo "  stop      - 서비스 중지"
    echo "  restart   - 서비스 재시작"
    echo "  logs      - 로그 확인"
    echo "  deploy    - 최신 코드로 재배포"
    echo "  backup    - 현재 버전 백업"
    echo "  rollback  - 이전 버전으로 롤백"
    echo "  health    - 헬스 체크"
    echo "  help      - 도움말"
}

check_services() {
    if systemctl is-active --quiet briend-app; then
        echo -e "React Router App: ${GREEN}실행 중${NC}"
    else
        echo -e "React Router App: ${RED}중지됨${NC}"
    fi
    
    if systemctl is-active --quiet briend-websocket; then
        echo -e "WebSocket Server: ${GREEN}실행 중${NC}"
    else
        echo -e "WebSocket Server: ${RED}중지됨${NC}"
    fi
    
    if systemctl is-active --quiet nginx; then
        echo -e "Nginx: ${GREEN}실행 중${NC}"
    else
        echo -e "Nginx: ${RED}중지됨${NC}"
    fi
}

show_logs() {
    print_header "최근 로그 (React Router App)"
    sudo journalctl -u briend-app --lines=20 --no-pager
    
    print_header "최근 로그 (WebSocket Server)"
    sudo journalctl -u briend-websocket --lines=20 --no-pager
}

health_check() {
    print_status "헬스 체크 수행 중..."
    
    if curl -f -s http://localhost:3000/ > /dev/null; then
        echo -e "React Router App: ${GREEN}정상${NC}"
    else
        echo -e "React Router App: ${RED}응답 없음${NC}"
    fi
    
    if curl -f -s http://localhost:3001/api/status > /dev/null; then
        echo -e "WebSocket Server: ${GREEN}정상${NC}"
    else
        echo -e "WebSocket Server: ${RED}응답 없음${NC}"
    fi
}

deploy() {
    print_error "수동 배포는 지원되지 않습니다."
    print_status "GitHub Actions를 통해 자동 배포를 사용하세요:"
    echo "  1. 코드를 feat/20250724 브랜치에 푸시"
    echo "  2. GitHub Actions가 자동으로 빌드 및 배포 수행"
    echo "  3. 배포 상태는 GitHub Actions 탭에서 확인"
    echo ""
    print_status "긴급 상황 시 서비스 재시작:"
    echo "  sudo systemctl restart briend-app"
    echo "  sudo systemctl restart briend-websocket"
}

case "${1:-help}" in
    "status")
        print_header "서비스 상태"
        check_services
        ;;
    "start")
        print_status "서비스 시작 중..."
        sudo systemctl start briend-websocket
        sudo systemctl start briend-app
        sudo systemctl start nginx
        check_services
        ;;
    "stop")
        print_status "서비스 중지 중..."
        sudo systemctl stop briend-app
        sudo systemctl stop briend-websocket
        check_services
        ;;
    "restart")
        print_status "서비스 재시작 중..."
        sudo systemctl restart briend-websocket
        sudo systemctl restart briend-app
        sudo systemctl restart nginx
        check_services
        ;;
    "logs")
        show_logs
        ;;
    "deploy")
        deploy
        ;;
    "backup")
        APP_DIR="/home/ubuntu/briend"
        BACKUP_NAME="briend-backup-$(date +%Y%m%d-%H%M%S)"
        print_status "백업 생성 중: $BACKUP_NAME"
        cp -r "$APP_DIR" "../$BACKUP_NAME"
        print_status "✅ 백업이 완료되었습니다: ../$BACKUP_NAME"
        ;;
    "health")
        health_check
        ;;
    "help"|*)
        show_help
        ;;
esac