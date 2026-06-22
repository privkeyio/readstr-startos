<p align="center">
  <img src="icon.png" alt="Readstr Logo" width="21%">
</p>

# Readstr on StartOS

> **Upstream docs:** <https://github.com/privkeyio/readstr>
>
> Everything not listed in this document should behave the same as upstream
> Readstr. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[Readstr](https://github.com/privkeyio/readstr) is a self-hosted, Google Reader-style feed aggregator for RSS/Atom, Nostr, and video. This package runs its Next.js standalone server alongside a bundled PostgreSQL database, so your subscriptions and reading state live entirely on your own server. You sign in with your own Nostr key (NIP-07 or NIP-46), organize subscriptions with tags or categories, and sync them across devices over Nostr.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| Image | `readstr`, built from source via the root `Dockerfile` |
| Source | `readstr` git submodule (upstream Next.js app + Prisma + tRPC) |
| Build | Next.js standalone build (Node 22 Alpine) bundled with PostgreSQL 16 and `su-exec` on an Alpine runtime |
| Architectures | x86_64, aarch64 |
| Entrypoint | `/usr/local/bin/docker_entrypoint.sh`, which boots PostgreSQL on localhost, runs Prisma migrations, then starts `node server.js` |

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | `/data` | Bundled PostgreSQL database and StartOS settings |

**Key paths on the `main` volume:**

- `/data/postgres`: the bundled PostgreSQL data directory (`PGDATA`) holding all feeds, subscriptions, and reading state
- `/data/start9/store.json`: StartOS persistent settings, namely the database password, default relays, and allowed hosts

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Database | Manual (docker-compose PostgreSQL) | Auto-bundled, initialized at `/data/postgres` on first start |
| DB password | User-supplied (`.env`) | Auto-generated internal secret (never shown) |
| Migrations | Run manually | Run automatically by the entrypoint (`prisma migrate deploy`) |
| Sign-in | Nostr key (NIP-07 / NIP-46) | Same |

**First-run steps:**

1. Open the **Web UI** from this service's page in StartOS.
2. Click **Connect with Nostr** and authorize with a browser extension (NIP-07, e.g. nos2x or Alby) on desktop, or pair a remote signer (NIP-46, e.g. Amber) on mobile. Your npub is your identity, so there is no separate account.
3. Use **Add Feed** to subscribe to RSS feeds, Nostr authors (npub or NIP-05), or YouTube/Rumble channels.
4. If you reach this server at a non-default address, set **Allowed Hosts** in the **Configure** action so NIP-98 login is accepted.

See [instructions.md](instructions.md) for the user-facing walkthrough.

---

## Configuration Management

| StartOS-Managed | Upstream-Managed (in-app) |
|-----------------|---------------------------|
| Database password (auto-generated internal secret) | Feed subscriptions and tags/categories |
| Default relays (Configure action) | Nostr identity (your key) |
| Allowed hosts for NIP-98 login (Configure action) | Reading state |

**Environment variables set by StartOS** (`startos/main.ts`):

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Next.js runtime mode |
| `PORT` | `3000` | Web UI bind port |
| `HOSTNAME` | `0.0.0.0` | Web UI bind address |
| `PGDATA` | `/data/postgres` | Bundled PostgreSQL data dir (on the backed-up `main` volume) |
| `DB_PASSWORD` | (auto-generated) | Password for the bundled PostgreSQL role |
| `DEFAULT_RELAYS` | (Configure) | Nostr relays for long-form content and profiles, comma-separated |
| `NIP98_ALLOWED_HOSTS` | (auto + Configure) | Hostnames allowed in NIP-98 auth: the interface's StartOS-assigned addresses (Tor, `.local`, LAN IP), plus any custom hosts from Configure |

Default relays are `wss://relay.damus.io`, `wss://nos.lol`, and `wss://relay.nostr.band`. The Configure action accepts any number of `wss://` relays; saving restarts the service to apply.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Web UI (`ui`) | 3000 | HTTP | Three-panel reader and NIP-98-authenticated app |

The Web UI is unmasked and carries no StartOS-level auth, because Readstr authenticates you with your own Nostr key (NIP-07 / NIP-46) and NIP-98 verifies the request host (see Allowed Hosts).

**Access methods:**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address (if added)
- Custom domains (if configured)

---

## Actions (StartOS UI)

### Configure

Set the Nostr relays and allowed hosts Readstr uses, then restart to apply.

| Property | Value |
|----------|-------|
| Availability | Any status |
| Visibility | Always visible |
| Inputs | Default Relays, Allowed Hosts (optional) |
| Outputs | Confirmation; restarts the service |

---

## Dependencies

None.

---

## Backups and Restore

**Included in backup:**

- `main` volume, covering the bundled PostgreSQL data (`/data/postgres`) and `store.json`

**Restore behavior:**

- The database and its password are restored together, so your feeds, subscriptions, reading state, relays, and allowed hosts come back as-is, with no re-import or reconfiguration. Init regenerates the database password only on a fresh install, never on restore.

---

## Health Checks

| Check | Display Name | Method | Messages |
|-------|--------------|--------|----------|
| `primary` | Web UI | Port-listening check on 3000 | "The Readstr web UI is ready" / "The Readstr web UI is not responding" |

---

## Limitations and Differences

1. **Custom domains require Allowed Hosts.** Readstr verifies the host in the NIP-98 auth token. The package auto-allows every address StartOS assigns the interface (Tor `.onion`, `.local`, LAN IP), so Tor and LAN work out of the box; for a custom domain you added yourself, set it in **Allowed Hosts** in Configure or login at that address may be rejected.
2. **Bundled single-node PostgreSQL.** The database runs inside the service container, not as a separate StartOS service, and is initialized and migrated automatically on first start.
3. **Nostr sign-in required.** There is no separate account system; your npub is your identity.

---

## What Is Unchanged from Upstream

- RSS/Atom feed aggregation in a three-panel reader
- Nostr long-form content (NIP-23) alongside RSS
- YouTube and Rumble video subscriptions
- Tag- and category-based organization with cross-device sync over Nostr
- Nostr sign-in via NIP-07 and NIP-46 remote signers
- The Next.js standalone server, tRPC API, and Prisma schema

---

## Contributing

This package targets **StartOS 0.4.x** and uses the StartOS TypeScript SDK.

```sh
git clone --recurse-submodules https://github.com/privkeyio/readstr-startos
cd readstr-startos
make            # produces readstr_x86_64.s9pk and readstr_aarch64.s9pk
make install    # installs to the host in ~/.startos/config.yaml
```

The `readstr` git submodule pins the upstream source built into the image. CI builds the `.s9pk` on PRs to `main` (`.github/workflows/build.yml`, requires the `DEV_KEY` secret from `start-cli init-key`) and publishes on `v*` tags (`.github/workflows/release.yml`, plus the registry/S3 vars and secrets).

---

## Quick Reference for AI Consumers

```yaml
package_id: readstr
architectures: [x86_64, aarch64]
image: readstr (built from source; Next.js standalone + bundled PostgreSQL)
volumes:
  main: /data
ports:
  ui: 3000
dependencies: none
startos_managed_env_vars:
  - NODE_ENV
  - PORT
  - HOSTNAME
  - PGDATA
  - DB_PASSWORD
  - DEFAULT_RELAYS
  - NIP98_ALLOWED_HOSTS
actions:
  - configure
health_checks:
  - primary: port_check 3000
backup_volumes:
  - main
```
