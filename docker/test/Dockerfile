FROM base as base

WORKDIR /app

# Install only production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Default to running tests
CMD ["pnpm", "test"]