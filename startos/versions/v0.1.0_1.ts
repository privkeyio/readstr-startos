import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v0_1_0_1 = VersionInfo.of({
  version: '0.1.0:1',
  releaseNotes: {
    en_US: 'Add privacy policy page and fix Chrome extension read-state sync.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
