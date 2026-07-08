import { VersionGraph } from '@start9labs/start-sdk'
import { v0_1_0_0 } from './v0.1.0_0'
import { v0_1_0_1 } from './v0.1.0_1'

export const versionGraph = VersionGraph.of({
  current: v0_1_0_1,
  other: [v0_1_0_0],
})
