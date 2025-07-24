# Multi-stage build for Briend React Router + Bun WebSocket Server
FROM oven/bun:1.2.18-alpine AS base

# Install curl for health checks
RUN apk add --no-cache curl

# Install dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the React Router app
RUN bun run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 briend && \
    adduser --system --uid 1001 briend

# Copy built application and server files
COPY --from=builder --chown=briend:briend /app/build ./build
COPY --from=builder --chown=briend:briend /app/server.ts ./
COPY --from=builder --chown=briend:briend /app/package.json ./
COPY --from=deps --chown=briend:briend /app/node_modules ./node_modules

# Switch to non-root user
USER briend

# Expose ports
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start both servers with Bun
CMD ["sh", "-c", "bun run ./node_modules/.bin/react-router-serve ./build/server/index.js & NODE_ENV=production bun run server.ts & wait"]