#!/bin/bash

# 최소한의 EC2 설정 스크립트 (소스코드 클론 없음)
# Docker 설치 + 기본 환경만 구성

set -e

echo "🚀 EC2 최소 환경 설정 시작..."

# 시스템 업데이트
echo "📦 시스템 패키지 업데이트..."
sudo yum update -y

# Docker 설치
echo "🐳 Docker 설치..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# 방화벽 설정
echo "🔒 방화벽 설정..."
sudo yum install -y iptables-services
sudo systemctl start iptables
sudo systemctl enable iptables

# 애플리케이션 포트 허용
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT   # SSH
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT   # HTTP
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT  # HTTPS  
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT # React Router
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT # WebSocket
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -i lo -j ACCEPT
sudo service iptables save

# CloudWatch 에이전트 설치 (선택사항)
echo "📊 CloudWatch 에이전트 설치..."
wget -q https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm
rm -f ./amazon-cloudwatch-agent.rpm

echo "✨ EC2 최소 환경 설정 완료!"
echo ""
echo "📋 완료된 작업:"
echo "✅ Docker 설치 및 시작"
echo "✅ 방화벽 포트 설정 (22, 80, 443, 3000, 3001)"
echo "✅ CloudWatch 에이전트 설치"
echo ""
echo "🔄 다음 단계:"
echo "1. 로그아웃 후 재접속 (Docker 그룹 권한 적용)"
echo "2. GitHub Actions에서 자동 배포 대기"
echo ""
echo "🌐 배포 후 접속 URL:"
echo "   - 애플리케이션: http://$(curl -s ifconfig.me):3000"
echo "   - WebSocket: ws://$(curl -s ifconfig.me):3001/ws"