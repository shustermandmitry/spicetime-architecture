FROM base as base

WORKDIR /app

# Install development dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Switch to non-root user
RUN adduser -D appuser
USER appuser

# Expose ports and set commands
EXPOSE 3000
CMD ["pnpm", "dev"]