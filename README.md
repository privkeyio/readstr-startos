<p align="center">
  <img src="icon.png" alt="Readstr Logo" width="21%">
</p>

# Readstr on StartOS

> Everything not listed in this document should behave the same as upstream
> Readstr. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Readstr](https://github.com/privkeyio/readstr) is a reader for RSS feeds, Nostr long-form articles, and video subscriptions, with your Nostr identity as the login. This package runs it with a private PostgreSQL sidecar and keeps its login allow-list in step with whatever addresses StartOS assigns the service.

- **Upstream repo:** <https://github.com/privkeyio/readstr>
- **Wrapper repo:** <https://github.com/Start9-Community/readstr-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Two images: the application, built from the vendored upstream, and a PostgreSQL sidecar.

| Property      | Value                                              |
| ------------- | -------------------------------------------------- |
| Images        | Built from the upstream submodule, plus `postgres` |
| Architectures | x86_64, aarch64                                    |
| Command       | Each image's own entrypoint                        |

| Subcontainer   | Purpose                                    |
| -------------- | ------------------------------------------ |
| `readstr-sub`  | The application — attach here for app logs |
| `postgres-sub` | The private database                       |

**The application image is upstream's**, built from the vendored source with the package's `Dockerfile`: upstream's own, except that the Prisma CLI is installed under `/opt/prisma-cli` and linked into `node_modules/.bin`, because `npm install` run inside the app directory crashes while resolving the app's manifest. Its entrypoint runs the database migrations before starting the server, so there is no migration oneshot here — that ordering is the image's.

## Volume and Data Layout

Two volumes, backed up by different mechanisms.

| Volume | Mount Point           | Purpose                       |
| ------ | --------------------- | ----------------------------- |
| `main` | — not mounted         | The package's own store       |
| `db`   | `/var/lib/postgresql` | The PostgreSQL data directory |

**The application container mounts nothing.** Everything Readstr knows — subscriptions, read state, cached articles — is in PostgreSQL, and the package's own settings are read by this package's code rather than by the app.

| Path                            | Written by          | Holds                                                        |
| ------------------------------- | ------------------- | ------------------------------------------------------------ |
| _PGDATA_                        | PostgreSQL          | Feeds, subscriptions, and everything read                    |
| `start9/store.json` (on `main`) | Init and the action | The database password, relays, allowed hosts, Flash settings |

## File Models

One model, holding four things.

| File         | Format | Modelled                | Written by          |
| ------------ | ------ | ----------------------- | ------------------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | Init and the action |

- **The database password**, generated once at install. The cluster was initialized with it, so it is not rotatable — and it is generated URL-safe because it is embedded in the connection string.
- **The default relay list**, seeded from the package's defaults and passed to the application as environment.
- **Extra allowed hosts**, for a custom domain.
- **Flash payment settings** — the checkout URL, the webhook signing secret and the API key, all optional (`null` when unset). Each is passed to the application as environment only when set; the API key also needs a service ID derived from the checkout URL (see below).

Everything else is passed as environment at start, and one of those values is computed rather than stored — see below.

**Readstr's login is bound to the host the browser used.** It authenticates with NIP-98, where each signed request commits to the address it was sent to, and the server rejects any host not on its allow-list. So the package reads the interface's **current addresses** and allows all of them, which is what makes login work over LAN, over a `.local` name, and over Tor without configuration. The read is reactive: adding a Tor address later restarts the service so that address is allowed too.

Any custom hosts from the action are merged with those, never replacing them.

## Dependencies

None. PostgreSQL runs as a private sidecar of this service rather than as a StartOS dependency.

Readstr fetches feeds and Nostr content from the internet, so it needs a connection to be useful.

## Network Access and Interfaces

One interface.

| Interface | Id   | Type | Port | Description |
| --------- | ---- | ---- | ---- | ----------- |
| Web UI    | `ui` | ui   | 3000 | The reader  |

Bound on the `ui-multi` MultiHost over HTTP and not masked. **Readstr's own Nostr login gates it**, and StartOS adds no gate of its own.

PostgreSQL is bound to loopback inside the service's own namespace and is not exported.

**A newly added address works only after the service restarts**, since the allow-list is computed at start — but the restart happens on its own, because the address list is watched.

## Installation and First-Run Flow

Install generates the database password and seeds the default relays. There is no task and no credential to record.

**There is no account to create.** You sign in with a Nostr key — a browser extension or another NIP-07 signer — and the identity is yours rather than the server's. The first start runs the database migrations before the interface answers, which is why the daemon carries a generous grace period.

## Actions

One action.

### Configure

Sets the default relay list, any extra hosts allowed for login, and the Flash payment settings.

- **What it changes:** both lists and the three Flash fields in the store.
- **Cost:** the service restarts, explicitly — the action requests it rather than relying on a reactive read.
- **Repeat safety:** idempotent, pre-filled with the current values.
- **Relays are validated** as `wss://` URLs by the form.
- **Allowed hosts are additive.** The addresses StartOS assigns are always permitted; this list is for a custom domain the OS does not know about.
- **Flash Checkout URL** (optional, must be `https://`) becomes `FLASH_CHECKOUT_URL`, the Flash plan signup URL; Readstr appends `?ref=<pubkey>` to it. Unset, the app's subscribe link goes nowhere.
- **Flash Webhook Secret** (optional, masked, must start with `whsec_`) becomes `FLASH_WEBHOOK_SECRET`, the signing secret of the Flash webhook endpoint. Readstr verifies the `Flash-Signature` HMAC on every `POST` to `https://<your domain>/api/webhooks/flash` with it; unset, that endpoint answers 500 and notifications cannot update subscription state. The form pre-fills it (masked) like the other fields. Blank fields are stored as `null`.
- **Flash API Key** (optional, masked) becomes `FLASH_API_KEY`; create it with only the **View Subscriptions** scope. Readstr calls Flash's API on the checkout URL's host, so it needs **Flash Checkout URL** too. With it, each webhook is checked against Flash's own subscription records, and a reader whose access is denied or about to run out is re-checked, within per-user and global rate limits, which recovers from dropped or out-of-order webhooks. If Flash can't be reached, the webhook is applied as before.
- **Service scoping.** Reconciliation lists every subscription with the reader's pubkey, so on a Flash account with several services it must be limited to Readstr's. The package takes the service ID from the checkout URL (`/subscriptions/signup/<serviceId>/<planId>`) and passes it as `FLASH_SERVICE_ID`. When the URL has no service ID, the API key is not passed and Readstr relies on webhooks alone.

Relays can also be managed inside the application; this list is the default the app starts from.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

Two checks, both shown.

| Check      | Displayed as | Method                                | Grace |
| ---------- | ------------ | ------------------------------------- | ----- |
| `postgres` | "Database"   | The database is accepting connections | —     |
| `primary`  | "Web UI"     | Port 3000 is listening                | 60s   |

The application waits for the database, so a failing database shows as the interface never starting rather than as two independent failures.

**Neither says anything about feeds.** An unreachable relay, a dead RSS source, or a feed that stopped updating all show green checks and are visible in the application.

## Backups and Restore

**The database is dumped; the store is copied.**

An rsync of a live PostgreSQL data directory is not crash-consistent, so the database is captured as a logical dump instead — which also survives a future PostgreSQL image bump rather than being tied to the on-disk format it was taken with. The `db` volume's files are never captured; a restore starts the engine and replays the dump into it.

The `main` volume is added alongside, which is what carries the database password — and the dump cannot be replayed without it, so the two halves are not independent.

A restored instance comes back with the same subscriptions and read state. Its allow-list is recomputed from the new server's addresses, so login works at the new address without intervention.

## Limitations and Differences

1. **Login is a Nostr key**, not a username and password. There is no account recovery here because there is no account.
2. **The database password cannot be rotated** — the cluster was initialized with it.
3. **A custom domain must be added to the allow-list** before NIP-98 login will work on it; StartOS-assigned addresses are automatic.
4. **The datastore is private.** PostgreSQL is a sidecar of this service and cannot be shared or substituted.
5. **The application container is stateless.** Anything not in PostgreSQL is not kept.
6. **Migrations run inside the image's entrypoint**, so a failed migration presents as the daemon not starting.

---

## Quick Reference for AI Consumers

```yaml
package_id: readstr
image: built from the vendored ./readstr submodule # plus the stock postgres image
architectures:
  - x86_64
  - aarch64
subcontainers:
  - readstr-sub # mounts nothing; entrypoint runs prisma migrate deploy, then the server
  - postgres-sub
volumes:
  main: null # not mounted; holds start9/store.json only
  db: /var/lib/postgresql
file_models:
  - start9/store.json # dbPassword, defaultRelays, nip98AllowedHosts, flashCheckoutUrl, flashWebhookSecret, flashApiKey
startos_managed_env_vars:
  - DATABASE_URL
  - DEFAULT_RELAYS
  - FLASH_CHECKOUT_URL # only when set in Configure
  - FLASH_WEBHOOK_SECRET # only when set in Configure
  - FLASH_API_KEY # only when set in Configure and FLASH_SERVICE_ID can be derived
  - FLASH_SERVICE_ID # computed from the checkout URL's /subscriptions/signup/<serviceId>/ path, only alongside FLASH_API_KEY
  - NEXT_TELEMETRY_DISABLED
  - NIP98_ALLOWED_HOSTS # computed from the interface's current addresses plus user hosts
  - NPM_CONFIG_UPDATE_NOTIFIER # false; stops the entrypoint's npx from calling the npm registry
  - POSTGRES_USER
  - POSTGRES_PASSWORD
  - POSTGRES_DB
dependencies: []
interfaces:
  ui: { type: ui, port: 3000 } # Readstr's own Nostr login; no gate added by StartOS
actions:
  - configure
tasks: []
health_checks:
  - postgres # displayed "Database"
  - primary # displayed "Web UI"; 60s grace for migrations
```
