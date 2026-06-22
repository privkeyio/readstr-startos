# Readstr

Readstr is a self-hosted, Google Reader-style feed aggregator. It brings RSS/Atom feeds together with Nostr long-form content (NIP-23) and video feeds from YouTube and Rumble in a clean, three-panel reading interface. Your subscriptions and reading state live on your own server in a bundled PostgreSQL database.

## First-time setup

1. **Open the Web UI.** Launch the interface from this service's page in StartOS.
2. **Sign in with Nostr.** Click "Connect with Nostr" and authorize with a browser extension (NIP-07, e.g. nos2x or Alby) on desktop, or pair a remote signer (NIP-46, e.g. Amber) with a `bunker://` connection string on mobile. Your npub is your identity, so there is no separate account.
3. **Add feeds.** Use "Add Feed" to subscribe to RSS feeds, Nostr authors (npub or NIP-05), or YouTube/Rumble channels.

## Login on a custom address

Readstr verifies the host in your NIP-98 auth token. Every address StartOS assigns this service (its `.onion`, `.local`, and LAN IP) is allowed automatically, so login works over Tor and on your LAN with no setup. If you reach the server at a custom domain you added yourself, set it in **Allowed Hosts** in the **Configure** action (comma-separated, hostname only); otherwise login at that address may be rejected.

## Configuration

Use the **Configure** action to set:

- **Default Relays:** the Nostr relays used to fetch long-form content and profiles. Defaults to `wss://relay.damus.io`, `wss://nos.lol`, and `wss://relay.nostr.band`.
- **Allowed Hosts:** extra hostnames to accept for NIP-98 login, for custom domains you added yourself. The service's StartOS addresses (Tor, `.local`, LAN IP) are already allowed automatically.

Saving the configuration restarts the service.

## Data and backups

All state, the PostgreSQL database and this package's settings, lives in the service's data volume and is captured by StartOS backups. Restoring a backup brings back your feeds, subscriptions, and reading state.
