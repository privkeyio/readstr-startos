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
  const env: Record<string, string> = {
    NODE_ENV: 'production',
    PORT: `${uiPort}`,
    HOSTNAME: '0.0.0.0',
    PGDATA: '/data/postgres',
    DB_PASSWORD: store.dbPassword,
    DEFAULT_RELAYS: store.defaultRelays.join(','),
  }
  if (store.nip98AllowedHosts) env.NIP98_ALLOWED_HOSTS = store.nip98AllowedHosts

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
    exec: { command: ['/usr/local/bin/docker_entrypoint.sh'] },
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
