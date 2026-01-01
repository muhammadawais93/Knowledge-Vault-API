# ============================================
# STAGE 1: Base Image
# ============================================
# This is the foundation - Node.js 20 LTS (Long Term Support)
# Alpine is a tiny Linux distribution (~5MB vs ~900MB for full Ubuntu)
FROM node:20-alpine AS base

# Set working directory - all commands run from here
WORKDIR /app

# ============================================
# STAGE 2: Development
# ============================================
FROM base AS development

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY src ./src

# Expose port for development
EXPOSE 3000

# Development command (will be overridden by docker-compose)
CMD ["npm", "run", "dev"]

# ============================================
# STAGE 3: Builder (for production build)
# ============================================
FROM base AS builder

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src ./src

RUN npm run build

# ============================================
# STAGE 4: Production
# ============================================
FROM base AS production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
