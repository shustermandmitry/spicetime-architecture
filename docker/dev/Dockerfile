FROM node:18-alpine

# Install essential tools
RUN apk add --no-cache \
    git \
    curl \
    python3 \
    make \
    g++ \
    libc6-compat

# Install and configure pnpm (matching version)
RUN corepack enable && corepack prepare pnpm@10.0.0-beta.1 --activate

# Set pnpm store directory to speed up builds
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir ${PNPM_HOME}/store
RUN pnpm install typescript ts-node-dev --global

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Type-check the project
RUN pnpm tsc --noEmit

# Use tini as init process
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

EXPOSE 3000

# Switch to non-root
RUN adduser -D appuser
USER appuser

# Start development server
CMD ["pnpm", "dev"]