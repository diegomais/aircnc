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

FROM deps AS builder
WORKDIR /app
COPY apps/backend/src ./apps/backend/src
COPY apps/backend/test ./apps/backend/test
COPY apps/backend/tsconfig.json ./apps/backend/tsconfig.json
COPY apps/backend/tsconfig.test.json ./apps/backend/tsconfig.test.json
RUN pnpm --filter aircnc-backend build

FROM base AS prod-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
RUN pnpm install --prod --frozen-lockfile --filter aircnc-backend...

FROM base AS runner
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY apps/backend/uploads ./apps/backend/uploads

ENV API_URL="http://localhost:3333"
ENV MONGODB_URI="mongodb://localhost:27017/aircnc"
ENV NODE_ENV="production"
ENV HOSTNAME="0.0.0.0"
ENV PORT=3333

EXPOSE 3333

CMD ["pnpm", "--filter", "aircnc-backend", "start"]
