export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Readstr': 0,
  'Web UI': 1,
  'The Readstr web UI is ready': 2,
  'The Readstr web UI is not responding': 3,

  // interfaces.ts
  'Browse your RSS feeds, Nostr long-form content, and video subscriptions': 4,

  // actions/configure.ts
  Configure: 5,
  'Configure the Nostr relays and allowed hosts': 6,
  'Default Relays': 7,
  'Nostr relays used to fetch long-form content and profiles': 8,
  'Allowed Hosts': 9,
  'Comma-separated hostnames clients use to reach this server (required for login when not using the default host). Leave blank to use the app default.': 10,
  'Configuration saved': 11,
  'The service is restarting with the new settings.': 12,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
