# readstr-startos

StartOS package for [Readstr](https://github.com/privkeyio/readstr) — a self-hosted, Google Reader-style feed aggregator for RSS/Atom, Nostr, and video.

It brings RSS/Atom feeds together with Nostr long-form content (NIP-23) and video feeds from YouTube and Rumble in a clean, three-panel reader. You sign in with your own Nostr key (NIP-07 or NIP-46), organize subscriptions with tags or categories, and sync them across devices over Nostr. Running it on StartOS gives you a private, always-on reader backed by its own bundled PostgreSQL database.

Built on the upstream [`readstr`](https://github.com/privkeyio/readstr) app (Next.js standalone server + Prisma + tRPC, served alongside a bundled PostgreSQL instance).

## Building

This package targets **StartOS 0.4.x** and uses the StartOS TypeScript SDK.

```sh
git clone --recurse-submodules https://github.com/privkeyio/readstr-startos
cd readstr-startos
make            # produces readstr_x86_64.s9pk and readstr_aarch64.s9pk
make install    # installs to the host in ~/.startos/config.yaml
```

The `readstr` git submodule pins the upstream source built into the image (the `Dockerfile` builds the Next.js standalone server and bundles PostgreSQL).

## Structure

- `startos/` — package definition (manifest, main daemon, interface, config store, action, i18n).
- `Dockerfile` — multi-stage build: Node (Next.js standalone) → slim runtime image with bundled PostgreSQL.
- `docker_entrypoint.sh` — boots PostgreSQL on localhost, runs Prisma migrations, then starts the app.
- `readstr/` — upstream source as a git submodule.

## CI

- **Build** (`.github/workflows/build.yml`): on PRs to `main` and manual dispatch, builds the `.s9pk` via Start9's shared workflow to verify it packs. Requires repo secret **`DEV_KEY`** (a StartOS developer key, `start-cli init-key`).
- **Release** (`.github/workflows/release.yml`): on `v*.*` tags, builds and publishes. Requires `DEV_KEY` plus the registry/S3 vars (`RELEASE_REGISTRY`, `S3_S9PKS_BASE_URL`) and secrets (`S3_ACCESS_KEY`, `S3_SECRET_KEY`).

See [`instructions.md`](instructions.md) for setup and usage.
</content>
</invoke>
