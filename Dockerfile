# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
RUN apt-get update && apt-get install -y ffmpeg
RUN apt-get install -y python3

WORKDIR /usr/src/app
ARG OPENAI_API_KEY
ARG CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG INNGEST_SIGNING_KEY
ARG DATABASE_URL
ARG SHADOW_DATABASE_URL

COPY package*.json bun.lockb ./
# Copy all files from apps/video
COPY apps/video/ ./apps/video
COPY apps/video/package*.json ./apps/video/
COPY packages/prisma/ ./packages/prisma
COPY packages/prisma/package*.json ./packages/prisma/

RUN bun install
RUN bun prisma generate

# run the app
EXPOSE 3001/tcp
ENTRYPOINT [ "bun", "run", "start:video" ]