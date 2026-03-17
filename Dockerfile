FROM oven/bun:1.3.10 AS builder
WORKDIR /app
COPY package*.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2
FROM oven/bun:1.3.10 AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN groupadd -r appgroup && useradd -r -g appgroup appuser && \
    chown -R appuser:appgroup /app
USER appuser
CMD ["bun", "index.ts"]