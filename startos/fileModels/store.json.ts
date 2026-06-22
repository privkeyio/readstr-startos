import { z, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { defaultRelays } from '../utils'

// Package-internal state. Written only by our init + actions, so .const()
// gives automatic restart-on-change.
const storeConfigSchema = z.object({
  // Generated once at install; password for the bundled PostgreSQL role.
  dbPassword: z.string().catch(''),
  // Default Nostr relays the app reads long-form content from.
  defaultRelays: z.array(z.string()).catch(defaultRelays),
  // Comma-separated hostnames allowed in NIP-98 auth tokens. Set this to the
  // address you use to reach this server so login works. Empty = app default.
  nip98AllowedHosts: z.string().catch(''),
})

export type StoreConfig = z.infer<typeof storeConfigSchema>

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'start9/store.json' },
  storeConfigSchema,
)
