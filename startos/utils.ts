import { z } from '@start9labs/start-sdk'

export const uiPort = 3000
export const postgresPort = 5432
export const postgresUser = 'readstr'
export const postgresDb = 'readstr'

export const defaultRelays = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band',
]

/**
 * The Flash service ID in a checkout URL (`/subscriptions/signup/<serviceId>/<planId>`),
 * or null when the URL doesn't have that shape. Readstr's API reconciliation
 * otherwise accepts subscriptions to every service on the Flash account.
 */
export function flashServiceIdFrom(checkoutUrl: string | null): string | null {
  if (!checkoutUrl) return null
  try {
    const parts = new URL(checkoutUrl).pathname.split('/').filter(Boolean)
    const signup = parts.indexOf('signup')
    const id =
      signup > 0 && parts[signup - 1] === 'subscriptions'
        ? parts[signup + 1]
        : undefined
    // Same check as Readstr's env validation, which would refuse to start otherwise.
    return id && z.uuid().safeParse(id).success ? id : null
  } catch {
    return null
  }
}
