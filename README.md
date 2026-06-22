# readstr-startos

StartOS package for [Readstr](https://github.com/privkeyio/readstr) — a Google Reader-style feed aggregator that combines RSS/Atom feeds with Nostr long-form content (NIP-23) and video feeds from YouTube and Rumble.

You sign in with your own Nostr key (NIP-07 or NIP-46), organize subscriptions with tags or categories, and sync them across devices over Nostr. Running it on StartOS gives you a private, always-on reader with its own bundled PostgreSQL database.

## Building

This package targets **StartOS 0.4.x** and uses the StartOS TypeScript SDK.

```sh
git clone --recurse-submodules https://github.com/privkeyio/readstr-startos
cd readstr-startos
npm ci          # install the TypeScript SDK
make            # produces readstr_x86_64.s9pk and readstr_aarch64.s9pk
make install    # installs to the host in ~/.startos/config.yaml
```

The `readstr` git submodule pins the upstream source built into the image (the `Dockerfile` builds the Next.js standalone server and bundles PostgreSQL).

## Structure

- `startos/` — package definition (manifest, main daemon, interface, config store, action, i18n).
- `Dockerfile` — multi-stage build: Node (Next.js standalone) + bundled PostgreSQL runtime image.
- `docker_entrypoint.sh` — boots PostgreSQL on localhost, runs Prisma migrations, then starts the app.
- `readstr/` — upstream source as a git submodule.

All state (the PostgreSQL data directory and `store.json`) lives under the `main` volume and is captured by StartOS backups.

## CI

- **Build** (`.github/workflows/build.yml`): on PRs to `main` and manual dispatch, builds the `.s9pk` via Start9's shared workflow. Requires repo secret **`DEV_KEY`**.
- **Release** (`.github/workflows/release.yml`): on `v*.*` tags, builds and publishes. Requires `DEV_KEY` plus the registry/S3 vars and secrets.

See [`instructions.md`](instructions.md) for setup and usage.
