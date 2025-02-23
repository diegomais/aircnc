# Set base image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Production image, copy all the files and run app
FROM base
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV API_URL="http://localhost:3333"
ENV MONGODB_URI="mongodb://localhost:27017/aircnc"
ENV NODE_ENV="production"
ENV HOSTNAME="0.0.0.0"
ENV PORT=3333

EXPOSE 3333

CMD ["yarn", "start"]
