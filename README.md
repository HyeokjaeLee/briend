# 🚀 Briend - Real-time WebSocket Application

A modern full-stack real-time application built with React Router, Bun WebSocket server, and deployed on AWS EC2 using Docker and GitHub Actions.

## ✨ Features

- 🚀 **Server-side rendering** with React Router 7
- ⚡️ **Real-time WebSocket communication** powered by Bun
- 🔄 **Multi-message types**: Echo, Broadcast, Chat
- 📦 **Containerized deployment** with Docker
- 🔒 **TypeScript** for type safety
- 🎉 **TailwindCSS** for modern styling
- 🤖 **CI/CD pipeline** with GitHub Actions
- ☁️ **AWS EC2 deployment** ready
- 🔒 **Production security** configurations

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  React Router   │    │   Bun WebSocket  │    │      Docker     │
│   Frontend      │◄──►│     Server       │◄──►│   Container     │
│   (Port 3000)   │    │   (Port 3001)    │    │    (AWS EC2)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Bun** 1.2.18 or higher
- **Docker** (for deployment)
- **Node.js** 20+ (optional, for npm scripts)

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/briend.git
cd briend

# Install dependencies
bun install
```

### Development

```bash
# Start both servers simultaneously
bun run dev:full

# Or start individually:
# Terminal 1: React Router dev server (port 5173)
bun run dev

# Terminal 2: Bun WebSocket server (port 3001)
bun run dev:server
```

Visit:
- **Frontend**: http://localhost:5173
- **WebSocket Demo**: http://localhost:5173/socket
- **WebSocket API**: ws://localhost:3001/ws
- **REST API**: http://localhost:3001/api/status

### Production Build

```bash
# Build the application
bun run build

# Start production servers
bun run start
```

## 🐳 Docker Deployment

### Local Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t briend .
docker run -p 3000:3000 -p 3001:3001 briend
```

### Production with Nginx

```bash
# Start with Nginx reverse proxy
docker-compose --profile production up -d
```

## ☁️ AWS EC2 Deployment

### 1. EC2 Setup

```bash
# Run on your EC2 instance
chmod +x scripts/setup-ec2.sh
./scripts/setup-ec2.sh
```

### 2. GitHub Actions CI/CD

Set up GitHub Secrets:
```
EC2_HOST: your-ec2-public-ip
EC2_USER: ec2-user  
EC2_SSH_KEY: your-private-ssh-key
```

### 3. Deploy

```bash
# Automatic deployment on push to main
git push origin main

# Or manual deployment on EC2
./scripts/deploy.sh production
```

📋 **Detailed guides:**
- [AWS EC2 Setup Guide](docs/AWS_EC2_SETUP.md)
- [Security Configuration](docs/SECURITY_GUIDE.md)

## 🎮 WebSocket API

### Connection

```javascript
const ws = new WebSocket('ws://localhost:3001/ws');
```

### Message Types

**Echo Message:**
```javascript
ws.send(JSON.stringify({
  type: 'echo',
  message: 'Hello World'
}));
```

**Broadcast Message:**
```javascript
ws.send(JSON.stringify({
  type: 'broadcast', 
  message: 'Message to all clients'
}));
```

**Chat Message:**
```javascript
ws.send(JSON.stringify({
  type: 'chat',
  message: 'Real-time chat message'
}));
```

## 📁 Project Structure

```
briend/
├── app/                    # React Router application
│   ├── hooks/             # Custom React hooks
│   │   └── useSocket.ts   # WebSocket hook
│   ├── routes/            # Route components
│   │   ├── _index.tsx     # Home page
│   │   └── socket.tsx     # WebSocket demo
│   └── root.tsx           # App root
├── server.ts              # Bun WebSocket server
├── scripts/               # Deployment scripts
│   ├── deploy.sh         # Production deployment
│   └── setup-ec2.sh      # EC2 initial setup
├── nginx/                 # Nginx configuration
├── docs/                  # Documentation
├── .github/workflows/     # GitHub Actions
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Container orchestration
└── package.json          # Dependencies & scripts
```

## 🛠️ Available Scripts

```bash
# Development
bun run dev              # React Router dev server
bun run dev:server       # Bun WebSocket server  
bun run dev:full         # Both servers simultaneously

# Production
bun run build            # Build for production
bun run start            # Start production servers
bun run preview          # Build and preview

# Utilities
bun run typecheck        # TypeScript type checking
```

## 🔧 Configuration

### Environment Variables

```bash
# .env
NODE_ENV=production
PORT=3001
```

### Docker Environment

```bash
# docker-compose.yml
environment:
  - NODE_ENV=production
  - PORT=3001
```

## 🚨 Monitoring & Health Checks

### Health Endpoints

- **Application**: `GET /health`
- **WebSocket API**: `GET /api/status`

### Docker Health Check

```bash
docker-compose ps    # Check container status
docker-compose logs  # View logs
```

## 🔒 Security Features

- ✅ **Non-root Docker user**
- ✅ **Security headers** (Nginx)
- ✅ **Rate limiting**
- ✅ **CORS protection** 
- ✅ **Input validation**
- ✅ **SSL/TLS ready**

## 📊 Performance

- **Multi-stage Docker build** for optimized images
- **Bun runtime** for fast WebSocket performance
- **Nginx reverse proxy** for production
- **Health checks** and automatic restarts
- **Log rotation** and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :3001
```

**Docker issues:**
```bash
# Reset Docker state
docker-compose down
docker system prune -af
docker-compose up -d
```

**WebSocket connection failed:**
- Check if Bun server is running on port 3001
- Verify firewall/security group settings
- Ensure both servers are started

### Logs

```bash
# Application logs
docker-compose logs -f

# System logs (EC2)
sudo journalctl -f

# WebSocket server logs
bun run dev:server
```

## 📞 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/briend/issues)
- 📖 **Documentation**: [docs/](docs/)
- 🚀 **Deployment**: [AWS EC2 Guide](docs/AWS_EC2_SETUP.md)

---

**Built with ❤️ using React Router 7, Bun, Docker, and AWS**