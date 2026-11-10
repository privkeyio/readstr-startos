import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { uiHostId, uiInterfaceId } from './interfaces'
import { sdk } from './sdk'
import { postgresDb, postgresPort, postgresUser, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Readstr'))

  const store = await storeJson.read().const(effects)
  if (!store) throw new Error('no store.json')

  // Readstr's NIP-98 auth binds each signed request to the host the browser
  // used and rejects hosts not on its allow-list. Allow every address StartOS
  // assigns this interface (.onion, .local, LAN IP) so login works over Tor and
  // LAN out of the box, plus any custom hosts set via Configure. .const() reruns
  // this (restarting the daemons) if the assigned addresses change later, e.g.
  // when a Tor address is added.
  const assignedHosts = await sdk.host
    .getOwn(effects, uiHostId, (host) => {
      const iface = Object.values(host?.bindings ?? {})
        .flatMap((b) => Object.values(b.interfaces))
        .find((i) => i.id === uiInterfaceId)
      return (iface?.addressInfo.nonLocal.hostnames ?? []).map(
        (h) => h.hostname,
      )
    })
    .const()
  const userHosts = (store.nip98AllowedHosts ?? [])
    .map((h) => h.trim())
    .filter(Boolean)
  const allowedHosts = [...new Set([...assignedHosts, ...userHosts])]

  // PostgreSQL runs as a sidecar subcontainer. Subcontainers in a service share
  // a network namespace, so the app reaches the database over localhost.
  const postgresSub = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'db',
      subpath: null,
      mountpoint: '/var/lib/postgresql',
      readonly: false,
    }),
    'postgres-sub',
  )

  const appSub = sdk.SubContainer.of(
    effects,
    { imageId: 'readstr' },
    sdk.Mounts.of(),
    'readstr-sub',
  )

  const databaseUrl = `postgresql://${postgresUser}:${store.dbPassword}@127.0.0.1:${postgresPort}/${postgresDb}`

  // The app image is upstream's: its entrypoint runs `prisma migrate deploy`
  // against DATABASE_URL, then `node server.js`.
  const env: Record<string, string> = {
    DATABASE_URL: databaseUrl,
    DEFAULT_RELAYS: store.defaultRelays.join(','),
    NEXT_TELEMETRY_DISABLED: '1',
    // The entrypoint's `npx prisma` otherwise asks registry.npmjs.org for a
    // newer npm on every start.
    NPM_CONFIG_UPDATE_NOTIFIER: 'false',
  }
  // NIP-98 binds each signed request to the host the browser used and rejects
  // anything off this list, so it has to track the interface's own addresses --
  // read .const() above, because adding a Tor address later must restart the
  // service or login silently fails on the new address.
  if (allowedHosts.length) env.NIP98_ALLOWED_HOSTS = allowedHosts.join(',')

  return sdk.Daemons.of(effects)
    .addDaemon('postgres', {
      subcontainer: postgresSub,
      exec: {
        command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
        env: {
          POSTGRES_USER: postgresUser,
          POSTGRES_PASSWORD: store.dbPassword,
          POSTGRES_DB: postgresDb,
        },
      },
      ready: {
        display: i18n('Database'),
        fn: async () => {
          const { exitCode } = await postgresSub.exec([
            'pg_isready',
            '-U',
            postgresUser,
            '-d',
            postgresDb,
            '-h',
            '127.0.0.1',
          ])

          if (exitCode !== 0) {
            return {
              result: 'loading',
              message: i18n('Waiting for PostgreSQL to be ready'),
            }
          }
          return {
            result: 'success',
            message: i18n('PostgreSQL is ready'),
          }
        },
      },
      requires: [],
    })
    .addDaemon('primary', {
      subcontainer: appSub,
      exec: { command: sdk.useEntrypoint(), env },
      ready: {
        display: i18n('Web UI'),
        gracePeriod: 60000,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The Readstr web UI is ready'),
            errorMessage: i18n('The Readstr web UI is not responding'),
          }),
      },
      requires: ['postgres'],
    })
})
