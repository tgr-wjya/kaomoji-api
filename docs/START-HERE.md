# START HERE

## What This Project Actually Is

Ignore the milestone wording for a minute. This API is only two features:

1. A persistent pet counter
2. A hardcoded kaomoji collection

That means you do **not** start by thinking about six endpoints.
You start by defining the two pieces of business logic the app needs.

## Build Order

### Phase 1: Nail the service layer first

Yes, start with the Service class first.

Not because services are magical, but because your routes are thin wrappers around a very small set of operations:

- get pet count
- increment pet count
- get random kaomoji
- get all kaomojis
- get kaomoji by id
- search kaomoji by name

If those methods exist and behave correctly, the endpoints become easy.

### Phase 2: Keep the services split

Do **not** make one giant `Service` class for everything.

Use two services:

- `PetService`
- `KaomojiService`

Optional later:

- `RedisClient` or `UpstashService` for the raw HTTP calls

That split matches the domain and keeps the code obvious.

## Recommended First Slice

Start with the part that has the least moving pieces:

1. Build `KaomojiService` against a hardcoded local dataset
2. Expose the kaomoji routes
3. Add not-found handling for invalid `:id`
4. Add search with query validation
5. Then build `PetService` with Upstash
6. Then add rate limiting to `POST /api/pet`
7. Then wire CORS and Swagger

Why this order:

- kaomoji logic is pure and local
- no env vars needed
- no external dependency needed
- you can prove your route structure and error handling early

## Minimal Architecture

You only need something this small:

```text
src/
  app.ts
  data/
    kaomojis.ts
  services/
    kaomoji.service.ts
    pet.service.ts
    upstash.client.ts
  errors/
    api.error.ts
    not-found.error.ts
    rate-limit.error.ts
```

You can go smaller if you want. Do not over-architect this.

## What Each Service Should Own

### `KaomojiService`

Methods:

- `getRandom()`
- `getAll()`
- `getById(id: number)`
- `search(query?: string)`

Rules:

- `getById()` throws a clean not-found error when index is invalid
- `search()` does case-insensitive substring matching on `name`
- if `query` is missing, `search()` returns a random kaomoji

### `PetService`

Methods:

- `getCount()`
- `increment()`

Rules:

- persistence lives in Upstash Redis
- service should hide the raw REST calls from routes
- routes should not know Redis URLs, tokens, or endpoints

## What Routes Should Do

Routes should be thin.

Each route should only:

1. validate params/body/query
2. call a service method
3. map errors to HTTP responses

If route handlers start containing search logic, random selection logic, Redis fetch code, or rate-limit internals, you've gone too fat in the route layer.

## The First Concrete Tasks

Do these in order:

1. Create the kaomoji dataset
2. Create `KaomojiService`
3. Add tests for:
   - random returns one item
   - all returns full list
   - valid id returns item
   - invalid id throws 404-style error
   - search filters by name
   - empty/missing search returns random
4. Wire kaomoji endpoints in `app.ts`
5. Create a tiny Upstash client
6. Create `PetService`
7. Add pet endpoints
8. Add rate limiter
9. Add CORS
10. Add Swagger

## The Real MVP

Your first meaningful checkpoint is not “all endpoints done”.

It is this:

- kaomoji dataset exists
- `KaomojiService` is finished
- all kaomoji endpoints work

Once that is done, the project becomes much less intimidating.

## Short Answer

If you're asking, "Should I nail the Service class first?"

Answer: **yes, but build the kaomoji service first, not the Redis-backed pet service.**

That gives you momentum without external setup slowing you down.
