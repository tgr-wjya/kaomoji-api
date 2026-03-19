FROM oven/bun:1.3.10 AS builder
WORKDIR /app
COPY package*.json bun.lock ./
RUN bun install --frozen-lockfile
# TODO: Move source-copy and any future build step into this stage if the runtime image starts carrying too much dev context.

# Stage 2
FROM oven/bun:1.3.10 AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
# TODO: Keep Upstash and deployment secrets injected at runtime via env vars, never baked into the image.
RUN groupadd -r appgroup && useradd -r -g appgroup appuser && \
    chown -R appuser:appgroup /app
USER appuser
# TODO: Compare this final image size against a single-stage build once the pet-counter feature lands.
CMD ["bun", "index.ts"]
