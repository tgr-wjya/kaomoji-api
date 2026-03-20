# kaomoji-api

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tgr-wjya/kaomoji-api/ci.yml)
[![codecov](https://codecov.io/gh/tgr-wjya/kaomoji-api/graph/badge.svg?token=2MM3tqOzJi)](https://codecov.io/gh/tgr-wjya/kaomoji-api)

### 19 march 2026

> a collection of kaomoji face, rest api for you

this project consist of a **pet counter** and a **kaomoji collection**

a hardcoded collection of text faces, for now.

## explore

- [kaomoji-api](#kaomoji-api)
  - [live url](#live-url)
  - [endpoints](#endpoints)
  - [kaomoji collection list](#kaomoji-collection-list)
  - [what i learned](#what-i-learned)
  - [stack](#stack)
  - [find me](#find-me)

## live url

check the api here: [kaomoji-api]

check out the openapi documentation here: [kaomoji-api openapi docs]

## endpoints

| method | what it does |
| ------------- | ----------------------------------------------------------------------------- |
| `GET  /api/pet-count` | current counter count |
| `POST /api/pet` | increment the counter with rate limiting |
| `GET  /api/kaomoji` | return random kaomoji |
| `GET  /api/kaomoji/all` | return full collection of kaomoji |
| `GET  /api/kaomoji/:id` | return kaomoji by its index |
| `GET  /api/kaomoji/search?q=` | allows you to filter kaomoji by name |

## kaomoji collection list

| kaomoji | name |
| ------------- | ----------------------------------------------------------------------------- |
| `ᵔᴥᵔ` | happy bear |
| `◉‿◉` | big eyes |
| `(｡◕‿◕｡)` | cute smile |
| `ʘ‿ʘ` | innocent |
| `¯\_(ツ)_/¯` | shrug |
| `ʕ•ᴥ•ʔ` | bear friend |
| `(☞ﾟヮﾟ)☞` | finger guns right |
| `☜(ﾟヮﾟ☜)` | finger guns left |
| `( ͡° ͜ʖ ͡°)` | lenny |
| `༼ つ ◕_◕ ༽つ` | give me |
| `(⌐■_■)` | deal with it |
| `(づ｡◕‿‿◕｡)づ` | hug coming |
| `(╯°□°)╯︵ ┻━┻` | table flip |
| `ಠ_ಠ` | look of disapproval |
| `ლ(ಠ益ಠλ)` | why |
| `(ノಠ益ಠ)ノ彡┻━┻` | angry table flip |
| `ಥ_ಥ` | cry |
| `┬─┬ノ( º _ ºノ)` | table respect |
| `༼ຈل͜ຈ༽` | lenny creeper |
| `ᕦ(ò_óˇ)ᕤ` | buff |
| `(つ ͡° ͜ʖ ͡°)つ` | come at me |

## what i learned

- codecov now supports tokenless reporting, just do this:

- ```yml
  - name: Upload coverage
    uses: codecov/codecov-action@v5.5.2
  ```

  - it'll automatically detect both the coverage files and token.
- between `t.Number()`, `t.Numeric()` and `t.Integer()` for your use case:
  - `t.Numeric()`: numeric accepts a numeric string or number before transforming the value into a number.
  - `t.Number()`: only accept number
    - both works fine but be careful if your handler only accepting `Integer` which is just `1` or `2` and not `1.34` value.
  - with `t.Integer()`: this solve the float params entirely.

- i was wrong about elysia `onError`...
  - elysia `onError` only catches errors thrown within the same plugin scope it's registered in. e.g. different scope meaning your `onError` won't be able to catch it.
  - i mistakenly assumed `onError` on the parent catches everything from all plugins regardless of registration order and scope.
  - turns out, it doesn't. the fix was simply moving `onError` inside `buildKaomojiRoutes` so it lives in the same scope as the errors it needs to catch.
  - you essentially have multiple `onError` for as many as routes you have.
- just found out about `it.each([])` and its awesome.
- essentially, you can check multiple url with identical assertion for example asserting wildcard on different scope, for example.

  - ```ts
      it.each([
        `${KAOMOJI_URL}/99`,
        `${KAOMOJI_URL}/api/99`,
        `${KAOMOJI_URL}/api/kaomoji/sgd9i1hwjk`,
    ])("returns 404 with wildcard fields on %s", async (url) => {
        const response = await app.handle(new Request(url, { method: "GET" }));

        expect(response.status).toBe(404);
        const body = (await response.json()) as WildcardError;
        expect(body).toHaveProperty("error", "Not Found");
        expect(body).toHaveProperty("timestamp");
        expect(body.availableEndpoints).toEqual(availableEndpointsArray);
        expect(body.availableEndpoints).toBeArray();
    });
    ```

  - and `%s` interpolates the current url so each run is still individually labeled in output.

- i accidentally double-encoded my `error.message` on `ValidationError`, it already is a JSON string so no need for `JSON.parse()` again.
- how spread pattern on `onError` work:
  - instead of having an early `returns` per branch like this:

  - ```ts
      if (error instanceof ValidationError) {
        set.status = 422;
        return {
          error: error.message,
        }
      }
    ```

  - you can try accumulating `extras` and spread into one final `return` like this:

  - ```typescript
    .onError(({ set, error }) => {
      const extra: Record<string, unknown> = {};

      if (error instanceof ValidationError) {
        set.status = 422;
        extra.error = JSON.parse(error.message);
      }

      return {
        error:
          extra.error ??
          (error instanceof Error ? error.message : "Unknown error"),
        timestamp: new Date().toISOString(),
        ...extra,
      };
    })
    ```

  - our `...extra` spreader would only return `extra` if it matches our `Error`.
  - basically, if we have this: `if (error === 'Not Found')`
  - then your extra would only print if that if is valid.

## stack

- **runtime**: bun + elysia (my favorite)
- **formatter:** biomejs (my goat)
- **docker**
- **ci**: github actions only (circleci redundant, github actions could handle everything.)
- **registry:** azure container registries
- **deployment:** azure container app
- **persistence:** upstash redis (this is the real deal)
- **coverage:** just codecov.

## find me

[portfolio](https://tgr-wjya.github.io) · [linkedin](https://linkedin.com/in/tegar-wijaya-kusuma-591a881b9) · [email](mailto:tgr.wjya.queue.top126@pm.me)

---

made with ◉‿◉
