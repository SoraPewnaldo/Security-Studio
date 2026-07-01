FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root
COPY package.json package-lock.json* ./
COPY packages/types/package.json ./packages/types/
COPY packages/core/package.json ./packages/core/
COPY packages/tool-sdk/package.json ./packages/tool-sdk/
COPY packages/utils/package.json ./packages/utils/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN npm ci --workspace=apps/api --include-workspace-root

# Copy source
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build TypeScript
RUN npm run build --workspace=apps/api

# ============================================================
# Production stage
# ============================================================
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/api/dist/ ./apps/api/dist/
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/node_modules/ ./apps/api/node_modules/
COPY --from=builder /app/apps/api/prisma/ ./apps/api/prisma/

# Create data directory
RUN mkdir -p /data

ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/security-studio.db"

EXPOSE 4000

# Run migrations and start server
CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && node dist/index.js"]
