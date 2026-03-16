FROM docker.io/oven/bun:latest AS base

# Stage 1: Preparation
FROM base AS prepare

WORKDIR /app
RUN bun add -g turbo
COPY . .
RUN turbo prune @dotabot.js/discord --docker

# Stage 2: Build
FROM base AS builder
# Read in DATABASE_URL as build arg and set it as env variable
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
WORKDIR /app

# Install dependencies
COPY --from=prepare /app/out/json/ .
RUN bun install

# Copy the entire monorepo
COPY --from=prepare /app/out/full .

# Build all parts that have been pruned
RUN bun run build

# Stage 3: Run
FROM base AS runner

WORKDIR /app

COPY --from=builder /app .

WORKDIR /app/apps/discord

# Run the app
CMD ["bun", "start"]
