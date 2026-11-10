# Readstr

## Documentation

- [Readstr on GitHub](https://github.com/privkeyio/readstr) — the upstream project's README and source.

## What you get on StartOS

A private, always-on reader running on your own server. Readstr exposes a single **Web UI** interface — a three-panel reader for RSS/Atom feeds, Nostr long-form content (NIP-23), and YouTube/Rumble video subscriptions. Your subscriptions and reading state live in a database that ships with the package, so nothing leaves hardware you control. You sign in with your own Nostr key, so there is no separate account to create.

## Getting set up

1. Open the **Web UI** from this service's page.
2. Click **Connect with Nostr** and authorize with a browser extension (NIP-07, such as nos2x or Alby) on desktop, or pair a remote signer (NIP-46, such as Amber) with a `bunker://` string on mobile. Your npub is your identity.
3. Use **Add Feed** to subscribe to RSS feeds, Nostr authors (npub or NIP-05), or YouTube/Rumble channels.

## Using Readstr

### Connecting on a custom address

Readstr checks the host in your NIP-98 login token. Every address StartOS assigns this service — its `.onion`, `.local`, and LAN IP — is accepted automatically, so login works over Tor and on your LAN with no setup. If you reach the server at a **custom domain you added yourself**, add that hostname under **Allowed Hosts** in the **Configure** action, or login at that address may be rejected.

### Configure action

Use **Configure** to set:

- **Default Relays** — the Nostr relays Readstr uses to fetch long-form content and profiles; you can also manage relays from within the app. Defaults to `wss://relay.damus.io`, `wss://nos.lol`, and `wss://relay.nostr.band`.
- **Allowed Hosts** — extra hostnames to accept for NIP-98 login, for custom domains you added yourself.

Saving restarts the service so the new settings take effect.
