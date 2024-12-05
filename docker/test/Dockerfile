FROM node:18-alpine

# Install essential tools and pnpm
RUN apk add --no-cache git curl
RUN corepack enable && corepack prepare pnpm@>=9.14.4 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Default to running tests in watch mode
CMD ["pnpm", "test"]
