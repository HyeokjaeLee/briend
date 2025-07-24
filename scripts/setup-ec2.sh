#!/bin/bash

# EC2 서버 초기 설정 및 배포 스크립트
set -e

echo "🚀 Briend EC2 설정을 시작합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 기본 패키지 업데이트
print_status "시스템 패키지 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
print_status "필수 패키지 설치 중..."
sudo apt install -y curl wget nginx ufw

# Bun 설치
print_status "Bun 설치 중..."
if ! command -v bun &> /dev/null; then
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
    print_status "Bun 설치 완료: $(bun --version)"
else
    print_warning "Bun이 이미 설치되어 있습니다: $(bun --version)"
fi

# 방화벽 설정
print_status "방화벽 설정 중..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # React Router App
sudo ufw allow 3001/tcp  # WebSocket Server
sudo ufw --force enable

# 애플리케이션 디렉토리 생성
CURRENT_USER=$(whoami)
USER_HOME="$HOME"
APP_DIR="$USER_HOME/briend"
print_status "애플리케이션 디렉토리 설정 중..."

# 애플리케이션 디렉토리만 생성 (실제 배포는 GitHub Actions에서 처리)
mkdir -p "$APP_DIR"
print_status "애플리케이션 디렉토리 생성 완료: $APP_DIR"
print_warning "실제 애플리케이션 파일은 GitHub Actions를 통해 배포됩니다."

# systemd 서비스 파일 생성
print_status "systemd 서비스 파일 생성 중..."

# React Router 앱 서비스
sudo tee /etc/systemd/system/briend-app.service > /dev/null <<EOF
[Unit]
Description=Briend React Router Application
After=network.target
Wants=briend-websocket.service

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PATH=$USER_HOME/.bun/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=$USER_HOME/.bun/bin/bun run start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=briend-app

[Install]
WantedBy=multi-user.target
EOF

# WebSocket 서버 서비스
sudo tee /etc/systemd/system/briend-websocket.service > /dev/null <<EOF
[Unit]
Description=Briend WebSocket Server
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PATH=$USER_HOME/.bun/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=$USER_HOME/.bun/bin/bun run server.ts
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=briend-websocket

[Install]
WantedBy=multi-user.target
EOF

# systemd 리로드 및 서비스 등록
print_status "systemd 서비스 등록 중..."
sudo systemctl daemon-reload
sudo systemctl enable briend-app
sudo systemctl enable briend-websocket
print_warning "서비스는 첫 배포 시 자동으로 시작됩니다."

# Nginx 리버스 프록시 설정 (선택사항)
print_status "Nginx 설정 중..."
sudo tee /etc/nginx/sites-available/briend > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/briend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# Nginx 상태 확인
print_status "Nginx 서비스 상태 확인 중..."
sudo systemctl status nginx --no-pager -l

print_status "🎉 Briend EC2 설정이 완료되었습니다!"
print_status "앱 URL: http://$(curl -s http://checkip.amazonaws.com)"
print_status "관리 명령어:"
echo "  - 서비스 상태: sudo systemctl status briend-app"
echo "  - 로그 확인: sudo journalctl -u briend-app -f"
echo "  - 서비스 재시작: sudo systemctl restart briend-app"