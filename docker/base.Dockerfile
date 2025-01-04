FROM node:18-alpine

# Install essential tools
RUN apk add --no-cache git curl make g++ python3 tini

# Enable PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set PNPM caching
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir=${PNPM_HOME}/store