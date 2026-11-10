import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    // Generate the PostgreSQL password once, on fresh install. It lives in the
    // backed-up store.json and is URL-safe for DATABASE_URL.
    await storeJson.merge(effects, {
      dbPassword: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 32 }),
    })
  } else {
    // Seed any new schema defaults into the existing store on upgrade.
    await storeJson.merge(effects, {})
  }
})
