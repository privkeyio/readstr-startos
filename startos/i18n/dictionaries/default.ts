export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Readstr': 0,
  Database: 1,
  'Waiting for PostgreSQL to be ready': 2,
  'PostgreSQL is ready': 3,
  'Web UI': 4,
  'The Readstr web UI is ready': 5,
  'The Readstr web UI is not responding': 6,

  // interfaces.ts
  'Browse your RSS feeds, Nostr long-form content, and video subscriptions': 7,

  // actions/configure.ts
  Configure: 8,
  'Configure the Nostr relays and allowed hosts': 9,
  'Default Relays': 10,
  'The default Nostr relays Readstr uses to fetch long-form content and profiles. You can also manage relays within the app.': 11,
  'Allowed Hosts': 12,
  'Extra hostnames to accept for NIP-98 login, such as a custom domain you added. The addresses StartOS assigns this service are always allowed.': 13,
  'Relay URLs must start with wss://': 14,
  'Configuration saved': 15,
  'The service is restarting with the new settings.': 16,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
