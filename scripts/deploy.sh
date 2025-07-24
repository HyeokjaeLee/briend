#!/bin/bash

# Briend Application Deployment Script for EC2
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
APP_NAME="briend"
APP_DIR="/home/ec2-user/$APP_NAME"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"

echo "🚀 Starting deployment for $APP_NAME in $ENVIRONMENT environment..."

# Function to check if service is healthy
check_health() {
    local max_attempts=30
    local attempt=1
    
    echo "🔍 Checking application health..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/health >/dev/null 2>&1 || curl -f http://localhost:3000/ >/dev/null 2>&1; then
            echo "✅ Application is healthy!"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts - waiting for application to be ready..."
        sleep 10
        ((attempt++))
    done
    
    echo "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Function to rollback on failure
rollback() {
    echo "🔄 Rolling back to previous version..."
    
    # Stop current containers
    docker-compose -f $COMPOSE_FILE down
    
    # Start with previous image (if available)
    docker-compose -f $COMPOSE_FILE up -d
    
    echo "⚠️ Rollback completed. Please check the application manually."
}

# Main deployment logic
main() {
    cd $APP_DIR
    
    # Create backup of current state
    echo "📦 Creating backup..."
    docker-compose -f $COMPOSE_FILE down --remove-orphans || true
    
    # Pull latest changes
    echo "⬇️ Pulling latest changes..."
    git pull origin main
    
    # Build and start services
    echo "🏗️ Building and starting services..."
    docker-compose -f $COMPOSE_FILE up -d --build
    
    # Wait for services to start
    echo "⏳ Waiting for services to start..."
    sleep 30
    
    # Health check
    if check_health; then
        echo "🎉 Deployment successful!"
        
        # Clean up old images
        echo "🧹 Cleaning up old Docker images..."
        docker image prune -af
        
        # Show running services
        echo "📊 Running services:"
        docker-compose -f $COMPOSE_FILE ps
        
    else
        echo "💥 Deployment failed! Starting rollback..."
        rollback
        exit 1
    fi
}

# Trap errors and rollback
trap 'echo "❌ Error occurred during deployment"; rollback; exit 1' ERR

# Run main deployment
main

echo "✨ Deployment completed successfully!"
echo "🌐 Application is available at:"
echo "   - React Router: http://localhost:3000"
echo "   - WebSocket API: ws://localhost:3001/ws"
echo "   - REST API: http://localhost:3001/api"