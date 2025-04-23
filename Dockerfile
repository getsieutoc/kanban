FROM node:22.14-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Environment variables must be present at build time
ENV NODE_ENV=production
ARG DOMAIN
ENV DOMAIN=${DOMAIN}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG REDIS_URL
ENV REDIS_URL=${REDIS_URL}
ARG R2_BUCKET_NAME
ENV R2_BUCKET_NAME=${R2_BUCKET_NAME}
ARG R2_ENDPOINT
ENV R2_ENDPOINT=${R2_ENDPOINT}
RUN pnpm build

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Environment variables must be redefined at run time
ENV NODE_ENV=production
ARG DOMAIN
ENV DOMAIN=${DOMAIN}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG REDIS_URL
ENV REDIS_URL=${REDIS_URL}
ARG R2_BUCKET_NAME
ENV R2_BUCKET_NAME=${R2_BUCKET_NAME}
ARG R2_ENDPOINT
ENV R2_ENDPOINT=${R2_ENDPOINT}
USER nextjs
EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
