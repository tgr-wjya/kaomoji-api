# PROJECT: KAOMOJI API

## THE GOAL

Rebuild the portfolio-kaomoji-api from scratch — this time you own every line of it. The original was vibe-coded on Cloudflare Workers with KV. This version is Bun + Elysia on ACA, built the same way you built `docker-mastery2`: no scaffolding, no config copy-paste.

The app powers two real features on your portfolio site, so this isn't a throwaway project. Cold starts (~15s) are acceptable — ACA scales to zero, that's the deal.

---

## THE APP

Two features. Nothing more.

**1. Pet Counter** — a global counter that persists across deploys.
**2. Kaomoji Collection** — a hardcoded collection of text faces.

---

## FINAL API SURFACE

```
GET  /api/pet-count          — current count
POST /api/pet                — increment (rate limited)

GET  /api/kaomoji            — random kaomoji
GET  /api/kaomoji/all        — full collection
GET  /api/kaomoji/:id        — by index
GET  /api/kaomoji/search?q=  — filter by name substring
```

You won't build all of these at once. Follow the milestones.

---

## MILESTONE 1: PROJECT SKELETON + KAOMOJI COLLECTION

Get the app running with the read-only kaomoji endpoints first. No persistence, no rate limiting, nothing fancy.

### Build
- Project setup: Bun + Elysia + `@elysiajs/swagger` + Biome
- Implement these three endpoints:
  ```
  GET /api/kaomoji            — random kaomoji
  GET /api/kaomoji/all        — full collection
  GET /api/kaomoji/:id        — by index (404 on out-of-bounds)
  ```
- `KaomojiService` class that owns the collection and the three operations
- Custom error class for the 404 case (follow `guestbook-api` pattern)
- Swagger docs

### Success Criteria
- ✅ All three endpoints return correct responses
- ✅ `GET /api/kaomoji/999` returns a clean 404, not a crash
- ✅ Swagger UI works at `/swagger`
- ✅ `bunx biome ci` passes

---

## MILESTONE 2: SEARCH + TESTS

Add the search endpoint, then write tests for everything built so far.

### Build
- Add:
  ```
  GET /api/kaomoji/search?q=  — filter by name substring
  ```
- Validate `q` as an optional query param with TypeBox
- If `q` is absent, behave the same as `GET /api/kaomoji` (return random)
- Write the test suite covering all four kaomoji endpoints

### Success Criteria
- ✅ `GET /api/kaomoji/search?q=bear` returns only kaomojis whose name contains "bear"
- ✅ `GET /api/kaomoji/search` without `q` returns a random kaomoji
- ✅ `bun test` passes

---

## MILESTONE 3: BASIC CI

Get GitHub Actions running before you touch persistence or Docker. Catch issues early.

### Build
Write `.github/workflows/ci.yml` yourself:
- Trigger: push to all branches, PR to `main`
- Steps:
  1. `actions/checkout`
  2. `oven-sh/setup-bun`
  3. `bun ci`
  4. `bunx biome ci`
  5. `bun test --coverage --coverage-reporter=lcov`
  6. Upload to Codecov (`codecov/codecov-action`)

No deploy job yet. Just green CI.

### Success Criteria
- ✅ Push a branch → CI runs lint, format check, tests
- ✅ Biome step fails on formatting drift
- ✅ Break a test intentionally → CI goes red. Fix it → green.
- ✅ Codecov badge works on README

---

## MILESTONE 4: PET COUNTER + PERSISTENCE

Now add the stateful part.

### Persistence: Upstash Redis

The pet counter needs to survive redeploys. Use **Upstash Redis (free tier)**.

Why Upstash:
- Free tier: 10k commands/day, no expiry
- HTTP-based REST API — no client library needed, just `fetch`
- Zero config in ACA: two env vars (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)

```typescript
// hint: it's this simple
const res = await fetch(`${UPSTASH_URL}/incr/pet_count`, {
  headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
});
```

### Build
- `PetCounterService` that wraps two Upstash calls: `get` and `increment`
- Rate limiting on `POST /api/pet`: in-memory `Map<string, number>` + cleanup interval (same pattern as `guestbook-api`)
- IP from `CF-Connecting-IP` or `X-Forwarded-For`
- Implement:
  ```
  GET  /api/pet-count
  POST /api/pet
  ```
- Add tests for both endpoints (mock the Upstash fetch)
- Add CORS: only `https://tgr-wjya.github.io` and `http://localhost:3000`

### Success Criteria
- ✅ `GET /api/pet-count` returns a number that persists across server restarts
- ✅ `POST /api/pet` increments and rate limits correctly
- ✅ CORS headers are correct on all responses
- ✅ `bun test` still passes with the new tests

---

## MILESTONE 5: DOCKERFILE

Write it yourself, no copy-paste.

### Requirements
- Base image: `oven/bun:1.3.10` (pin it, don't use `latest`)
- Multi-stage: builder → runner
- Non-root user
- `COPY package*.json` before `COPY . .` (you know why)

### Success Criteria
- ✅ `docker build -t kaomoji-api .` succeeds
- ✅ `docker run -p 3000:3000 -e UPSTASH_REDIS_REST_URL=... -e UPSTASH_REDIS_REST_TOKEN=... kaomoji-api` works
- ✅ `GET /api/pet-count` returns a real count from Upstash inside the container
- ✅ Final image is smaller than a single-stage build (`docker images`)

---

## MILESTONE 6: CD WITH GHCR + ACA

Extend `ci.yml` with a deploy job. Container registry is **GitHub Container Registry (GHCR)** — free, no ACR needed.

### Build
Add a `deploy` job to your existing workflow:
- Runs only on `main`, only if `test` passes
- Logs in to GHCR with `docker/login-action` using `GITHUB_TOKEN` (no extra secret needed)
- Builds and pushes:
  ```
  ghcr.io/<your-github-username>/kaomoji-api:<sha>
  ghcr.io/<your-github-username>/kaomoji-api:latest
  ```
- Updates ACA to the new image via `azure/login` + `az containerapp update`
- Injects Upstash secrets as ACA environment variables

### Secrets Needed
```
AZURE_CREDENTIALS
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

`GITHUB_TOKEN` is automatic — GitHub injects it, you don't create it.

### Success Criteria
- ✅ Push to `main` → image builds, pushes to GHCR, ACA updates
- ✅ Pet count persists across deploys (deploy twice, check the count survives)
- ✅ No credentials in code
- ✅ Portfolio site integration works end-to-end

---

## WHAT YOU'RE NOT ALLOWED TO DO

- Scaffold the Dockerfile, `ci.yml`, or any config with an LLM
- Copy configs from `docker-mastery2` or `guestbook-api`
- Move to the next milestone without passing the current one's success criteria

You can ask for hints. You cannot ask for the solution.

---

## STACK

- Runtime: Bun + Elysia
- Formatter/Linter: Biome
- Container: Docker (multi-stage)
- CI/CD: GitHub Actions only
- Registry: GitHub Container Registry (GHCR)
- Deploy: Azure Container Apps (ACA)
- Persistence: Upstash Redis (HTTP REST API, no SDK)
- Coverage: Codecov

---

## NOTES

**On the ~15s cold start:** ACA scales to zero aggressively on the free tier. If it ever bothers you, `min_replica: 1` fixes it at the cost of always-on compute spend.

**On Upstash free tier limits:** 10k commands/day. Each `POST /api/pet` costs 1 command (`INCR`), each `GET /api/pet-count` costs 1 command (`GET`). You'd need 10k portfolio visitors per day to hit the limit. You're fine.

**On GHCR vs ACR:** GHCR is free for public repos and ties directly into GitHub Actions via `GITHUB_TOKEN` — no service principal, no registry credentials to manage. ACR only makes sense when you're already deep in the Azure ecosystem with multiple services sharing one registry.