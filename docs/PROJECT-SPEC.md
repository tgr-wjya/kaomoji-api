# PROJECT: KAOMOJI API

## THE GOAL

Rebuild the portfolio-kaomoji-api from scratch — this time you own every line of it. The original was vibe-coded on Cloudflare Workers with KV. This version is Bun + Elysia on ACA, built the same way you built `docker-mastery2`: no scaffolding, no config copy-paste.

The app powers two real features on your portfolio site, so this isn't a throwaway project. Cold starts (~15s) are acceptable — ACA scales to zero, that's the deal.

---

## THE APP

Two features. Nothing more.

**1. Pet Counter** — a global counter that persists across deploys.
**2. Kaomoji Collection** — a hardcoded collection of text faces. No rarity. Just kaomojis.

---

## API ENDPOINTS

```
GET  /api/pet-count          — current count
POST /api/pet                — increment (rate limited)

GET  /api/kaomoji            — random kaomoji
GET  /api/kaomoji/all        — full collection
GET  /api/kaomoji/:id        — by index
GET  /api/kaomoji/search?q=  — filter by name substring  ← NEW
```

The search endpoint is the one new addition worth building. It's simple — a substring match on the `name` field — but it teaches you query param handling in Elysia (`t.Object` on `query`) and is actually useful for a frontend that wants to look up a specific face by keyword.

---

## PERSISTENCE: UPSTASH REDIS

The pet counter needs to survive redeploys. In the original, Cloudflare KV handled this. On ACA, you need an external store.

**Use Upstash Redis (free tier).**

Why Upstash specifically:
- Free tier: 10k commands/day, no expiry
- HTTP-based REST API — no client library needed, just `fetch`
- Works from anywhere (no IP allowlisting)
- Zero config in ACA: two env vars (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)

You won't need the `ioredis` or `@upstash/redis` SDK. A raw `fetch` to their REST endpoint is enough for two commands (`GET`, `INCR`). This is intentional — you'll understand exactly what's happening.

```typescript
// hint: it's this simple
const res = await fetch(`${UPSTASH_URL}/incr/pet_count`, {
  headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
});
```

---

## RATE LIMITING

Same pattern as `guestbook-api`: in-memory `Map<string, number>` keyed by IP, with a cleanup interval. No Redis needed for rate limiting — it's per-instance and that's fine for a portfolio API.

One difference from guestbook: the IP comes from `CF-Connecting-IP` (if you put it behind Cloudflare) or `X-Forwarded-For`. Make it configurable.

---

## CORS

Only two origins need access:
```typescript
const ALLOWED_ORIGINS = [
  "https://tgr-wjya.github.io",
  "http://localhost:3000",
];
```

Handle the preflight `OPTIONS` and inject `Access-Control-Allow-Origin` in `onAfterHandle`. Don't use a wildcard `*` — your portfolio site is the only consumer.

---

## MILESTONE 1: BUILD THE API

### Requirements
- All six endpoints above implemented
- TypeBox validation on request body and query params
- Rate limiting on `POST /api/pet` (1 req/sec per IP)
- CORS for portfolio + localhost
- Swagger docs via `@elysiajs/swagger`
- Custom error classes (follow `guestbook-api` pattern)
- Upstash integration for pet count persistence

### Success Criteria
- ✅ `GET /api/pet-count` returns a number that persists across server restarts
- ✅ `POST /api/pet` increments the counter and rate limits correctly
- ✅ `GET /api/kaomoji/search?q=bear` returns only kaomojis whose name contains "bear"
- ✅ `GET /api/kaomoji/999` returns a clean 404, not a crash
- ✅ Swagger UI works at `/swagger`
- ✅ `OPTIONS` preflight returns correct CORS headers

---

## MILESTONE 2: DOCKERFILE

Same approach as `docker-mastery2`. Write it yourself, no copy-paste.

### Requirements
- Base image: `oven/bun:1.3.10` (pin it, don't use `latest`)
- Multi-stage: builder → runner (you've done this before)
- Non-root user
- `COPY package*.json` before `COPY . .` (you know why)

### Success Criteria
- ✅ `docker build -t kaomoji-api .` succeeds
- ✅ `docker run -p 3000:3000 -e UPSTASH_REDIS_REST_URL=... -e UPSTASH_REDIS_REST_TOKEN=... kaomoji-api` works
- ✅ `GET /api/pet-count` returns a real count from Upstash inside the container
- ✅ Final image is smaller than a single-stage build (`docker images`)

---

## MILESTONE 3: GITHUB ACTIONS CI

One pipeline, no CircleCI. Write `.github/workflows/ci.yml` yourself.

### Requirements
- Trigger: push to all branches, PR to `main`
- Steps in order:
  1. `actions/checkout`
  2. `oven-sh/setup-bun`
  3. `bun ci`
  4. `bunx biome ci` ← don't skip this like you almost did in docker-mastery
  5. `bun test --coverage --coverage-reporter=lcov`
  6. Upload to Codecov (`codecov/codecov-action`)
- Deploy job: only on `main`, only if test job passes
  - Follows same ACR/ACA pattern as `docker-mastery2`
  - Tag with `${{ github.sha }}`

### Secrets Needed
```
AZURE_CREDENTIALS
ACR_NAME
ACR_DNS_NAME
CODECOV_TOKEN
UPSTASH_REDIS_REST_URL       ← new
UPSTASH_REDIS_REST_TOKEN     ← new
```

The Upstash secrets get injected as environment variables on `az containerapp update`. Don't hardcode them anywhere.

### Success Criteria
- ✅ Push a branch → CI runs lint, format, tests
- ✅ Biome CI step fails if there's a formatting drift
- ✅ Push to `main` → image builds, pushes to ACR, ACA updates
- ✅ Codecov badge works on the README
- ✅ No credentials in code

---

## MILESTONE 4: DEPLOY TO ACA

Same flow as `docker-mastery2`. The only difference is that you need to set the Upstash env vars on the container app.

```bash
az containerapp update \
  --name kaomoji-api \
  --resource-group <rg> \
  --image <acr>.azurecr.io/kaomoji-api:<sha> \
  --set-env-vars \
    UPSTASH_REDIS_REST_URL=secretref:upstash-url \
    UPSTASH_REDIS_REST_TOKEN=secretref:upstash-token
```

### Success Criteria
- ✅ Live URL works
- ✅ Pet count persists across deploys (verify by deploying twice and checking the count)
- ✅ `GET /api/kaomoji/search?q=table` returns the table-flip kaomojis
- ✅ CORS headers are correct when called from the browser (check with devtools)
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
- CI: GitHub Actions only
- Registry: Azure Container Registry (ACR)
- Deploy: Azure Container Apps (ACA)
- Persistence: Upstash Redis (HTTP REST API, no SDK)
- Coverage: Codecov

---

## NOTES

**On the ~15s cold start:** ACA scales to zero aggressively on the free tier. That's fine for a portfolio. If it ever bothers you, `min_replica: 1` fixes it at the cost of always-on compute spend.

**On Upstash free tier limits:** 10k commands/day. Each `POST /api/pet` costs 1 command (`INCR`), each `GET /api/pet-count` costs 1 command (`GET`). You'd need 10k portfolio visitors per day to hit the limit. You're fine.

**On the search endpoint:** Elysia validates query params with `query: t.Object({ q: t.Optional(t.String()) })`. If `q` is absent, return the random kaomoji instead of erroring — that way `GET /api/kaomoji/search` without a query param still behaves sensibly.