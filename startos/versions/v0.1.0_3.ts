import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v0_1_0_3 = VersionInfo.of({
  version: '0.1.0:3',
  releaseNotes: {
    en_US:
      'Add OPML import/export, reading history with offline search, smart views, AI summaries and translation, on-device WebLLM, and Nostr sync for saved views and reading prefs.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
