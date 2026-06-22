import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Readstr'))

  const store = await storeJson.read().const(effects)
  if (!store) throw new Error('no store.json')

  // The image bundles PostgreSQL; the entrypoint boots it on localhost, runs
  // prisma migrations, then starts the Next.js server. Both the database and
  // the app data live under the mounted volume so backups capture everything.
  // Readstr's NIP-98 auth binds each signed request to the host the browser
  // used and rejects hosts not on its allow-list. Allow every address StartOS
  // assigns this interface (.onion, .local, LAN IP) so login works over Tor and
  // LAN out of the box, plus any custom hosts set via Configure. .const() reruns
  // this (restarting the daemon) if the assigned addresses change later, e.g.
  // when a Tor address is added.
  const ui = await sdk.serviceInterface.getOwn(effects, 'ui').const()
  const assignedHosts = (ui?.addressInfo?.hostnames ?? [])
    .map((h) => h.hostname)
    .filter(
      (h) =>
        !!h &&
        !['localhost', '127.0.0.1', '::1'].includes(h) &&
        !h.startsWith('fe80'),
    )
  const userHosts = (store.nip98AllowedHosts ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
  const allowedHosts = [...new Set([...assignedHosts, ...userHosts])]

  const env: Record<string, string> = {
    NODE_ENV: 'production',
    PORT: `${uiPort}`,
    HOSTNAME: '0.0.0.0',
    PGDATA: '/data/postgres',
    DB_PASSWORD: store.dbPassword,
    DEFAULT_RELAYS: store.defaultRelays.join(','),
  }
  if (allowedHosts.length) env.NIP98_ALLOWED_HOSTS = allowedHosts.join(',')

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'readstr' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/data',
      readonly: false,
    }),
    'readstr',
  )

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer,
    exec: { command: ['/usr/local/bin/docker_entrypoint.sh'], env },
    ready: {
      display: i18n('Web UI'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The Readstr web UI is ready'),
          errorMessage: i18n('The Readstr web UI is not responding'),
        }),
    },
    requires: [],
  })
})
