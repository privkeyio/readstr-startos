import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v0_1_0_2 = VersionInfo.of({
  version: '0.1.0:2',
  releaseNotes: {
    en_US: 'Update privacy policy contact email.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
