FROM node:20 AS base

ARG OPENAI_API_KEY
ARG CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG INNGEST_SIGNING_KEY
ARG DATABASE_URL
ARG SHADOW_DATABASE_URL


FROM base AS builder

RUN apt-get update && apt-get install -y ffmpeg
RUN apt-get install -y python3

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn prisma generate

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/apps/video /app/apps/video
COPY --from=builder --chown=hono:nodejs /app/packages/prisma /app/packages/prisma
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3001

CMD ["yarn", "start:video"]