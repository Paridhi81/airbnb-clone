# ---- Frontend Dockerfile (Next.js 15, standalone output) ----
# Multi-stage build so the runtime image is small.

FROM node:20-alpine AS deps
WORKDIR /srv/frontend
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 300000

FROM node:20-alpine AS builder
WORKDIR /srv/frontend
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /srv/frontend/node_modules ./node_modules
COPY . .
# FASTAPI_URL is read at build time by next.config.js rewrites();
# override it at runtime with docker-compose if needed.
ENV FASTAPI_URL=http://backend:8001
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /srv/frontend
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nextjs && adduser --system --uid 1001 nextjs

# next.js standalone output copies only what's needed at runtime
COPY --from=builder /srv/frontend/public ./public
COPY --from=builder --chown=nextjs:nextjs /srv/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /srv/frontend/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
