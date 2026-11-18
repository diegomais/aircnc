FROM node:24-alpine AS base
RUN corepack enable

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
RUN pnpm install --frozen-lockfile --filter aircnc-backend...

FROM base AS runner
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY apps/backend/src ./apps/backend/src
COPY apps/backend/uploads ./apps/backend/uploads

ENV API_URL="http://localhost:3333"
ENV MONGODB_URI="mongodb://localhost:27017/aircnc"
ENV NODE_ENV="production"
ENV HOSTNAME="0.0.0.0"
ENV PORT=3333

EXPOSE 3333

CMD ["pnpm", "--filter", "aircnc-backend", "start"]
