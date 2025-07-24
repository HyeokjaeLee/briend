#!/bin/bash

# EC2 Initial Setup Script for Briend Application
# Run this script on your EC2 instance after launch

set -e

echo "🚀 Setting up EC2 instance for Briend application..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "🏗️ Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Install Git
echo "📚 Installing Git..."
sudo yum install -y git

# Install Node.js and Bun (for development/debugging)
echo "📦 Installing Node.js and Bun..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
curl -fsSL https://bun.sh/install | bash
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc

# Create application directory
echo "📁 Setting up application directory..."
mkdir -p /home/ec2-user/briend
cd /home/ec2-user/briend

# Clone repository (you'll need to add your repo URL)
echo "📦 Setting up repository..."
echo "⚠️  Please clone your repository manually:"
echo "    git clone https://github.com/YOUR_USERNAME/briend.git ."
echo "    Or copy your files to /home/ec2-user/briend/"

# Create systemd service for auto-start
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/briend.service > /dev/null <<EOF
[Unit]
Description=Briend Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ec2-user/briend
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0
User=ec2-user
Group=ec2-user

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl daemon-reload
sudo systemctl enable briend.service

# Configure firewall (if using iptables)
echo "🔒 Configuring firewall..."
sudo yum install -y iptables-services
sudo systemctl start iptables
sudo systemctl enable iptables

# Allow SSH, HTTP, HTTPS, and application ports
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -i lo -j ACCEPT
sudo service iptables save

# Install CloudWatch agent (optional)
echo "📊 Installing CloudWatch agent..."
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Create CloudWatch config
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null <<EOF
{
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/messages",
                        "log_group_name": "/aws/ec2/briend/system",
                        "log_stream_name": "{instance_id}"
                    }
                ]
            }
        }
    },
    "metrics": {
        "namespace": "CWAgent",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "diskio": {
                "measurement": [
                    "io_time"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    }
}
EOF

echo "✨ EC2 setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Log out and log back in to apply Docker group membership"
echo "2. Clone your repository to /home/ec2-user/briend/"
echo "3. Set up GitHub Secrets for CI/CD:"
echo "   - EC2_HOST: Your EC2 public IP or domain"
echo "   - EC2_USER: ec2-user"
echo "   - EC2_SSH_KEY: Your private SSH key"
echo "4. Run your first deployment: ./scripts/deploy.sh"
echo ""
echo "🌐 Your application will be available at:"
echo "   - HTTP: http://YOUR_EC2_PUBLIC_IP:3000"
echo "   - WebSocket: ws://YOUR_EC2_PUBLIC_IP:3001/ws"