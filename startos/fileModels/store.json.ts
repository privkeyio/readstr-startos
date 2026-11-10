import { z, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { defaultRelays } from '../utils'

// Package-internal state. Written only by our init + actions, so .const()
// gives automatic restart-on-change.
const storeConfigSchema = z.looseObject({
  // Generated once at install; password for the bundled PostgreSQL role.
  dbPassword: z.string().catch(''),
  // The relays the app uses by default (passed as DEFAULT_RELAYS); users can
  // add their own in-app. Seeded from the defaultRelays const.
  defaultRelays: z.array(z.string()).catch(defaultRelays),
  // Extra hostnames allowed in NIP-98 auth tokens, for custom domains the user
  // added. The StartOS-assigned addresses are always allowed (see main.ts).
  nip98AllowedHosts: z.array(z.string()).catch([]),
})

export type StoreConfig = z.infer<typeof storeConfigSchema>

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'start9/store.json' },
  storeConfigSchema,
)
