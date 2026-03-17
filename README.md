# kaomoji-api

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tgr-wjya/kaomoji-api/ci.yml)
[![codecov](https://codecov.io/gh/tgr-wjya/kaomoji-api/graph/badge.svg?token=2MM3tqOzJi)](https://codecov.io/gh/tgr-wjya/kaomoji-api)

### 18 march 2026

> kaomoji rest api for you

this project consist of a **pet counter** and a **kaomoji collection**

a hardcoded collection of text faces, for now.

## explore

- [kaomoji-api](#kaomoji-api)
    - [18 march 2026](#18-march-2026)
  - [explore](#explore)
  - [links](#links)
  - [endpoint](#endpoint)
  - [kaomoji collection list](#kaomoji-collection-list)
  - [what i learned](#what-i-learned)
  - [stack](#stack)
  - [find me](#find-me)

## links

check the api here: [kaomoji-api]

check out the openapi documentation here: [kaomoji-api openapi docs]

## endpoint

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
| `ᵔᴥᵔ` | **happy bear** |
| `◉‿◉` | **big eyes** |
| `(｡◕‿◕｡)` | **cute smile** |
| `ʘ‿ʘ` | **innocent** |
| `¯\_(ツ)_/¯` | **shrug** |
| `ʕ•ᴥ•ʔ` | **bear friend** |
| `(☞ﾟヮﾟ)☞` | **finger guns right** |
| `☜(ﾟヮﾟ☜)` | **finger guns left** |
| `( ͡° ͜ʖ ͡°)` | **lenny** |
| `༼ つ ◕_◕ ༽つ` | **give me** |
| `(⌐■_■)` | **deal with it** |
| `(づ｡◕‿‿◕｡)づ` | **hug coming** |
| `(╯°□°)╯︵ ┻━┻` | **table flip** |
| `ಠ_ಠ` | **look of disapproval** |
| `ლ(ಠ益ಠλ)` | **why** |
| `(ノಠ益ಠ)ノ彡┻━┻` | **angry table flip** |
| `ಥ_ಥ` | **cry** |
| `┬─┬ノ( º _ ºノ)` | **table respect** |
| `༼ຈل͜ຈ༽` | **lenny creeper** |
| `ᕦ(ò_óˇ)ᕤ` | **buff** |
| `(つ ͡° ͜ʖ ͡°)つ` | **come at me** |

## what i learned

- codecov now supports tokenless reporting, just do this:

```yml
- name: Upload coverage
  uses: codecov/codecov-action@v5.5.2
```

- it'll automatically detect both the coverage file and token.

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
