import { sdk } from './sdk'
import { postgresDb, postgresUser } from './utils'
import { storeJson } from './fileModels/store.json'

// db is dumped rather than rsynced, and .addVolume('main') carries the password
// the dump needs to replay. withPgDump starts from an empty volume list, so a
// new volume is silently excluded unless it is added here too.
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withPgDump({
    imageId: 'postgres',
    dbVolume: 'db',
    mountpoint: '/var/lib/postgresql',
    pgdataPath: '/data',
    database: postgresDb,
    user: postgresUser,
    password: async () => {
      const pw = await storeJson.read((s) => s.dbPassword).once()
      if (!pw) throw new Error('No database password found in store.json')
      return pw
    },
  }).addVolume('main'),
)
