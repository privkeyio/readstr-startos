import { VersionGraph } from '@start9labs/start-sdk'
import { v0_1_0_0 } from './v0.1.0_0'
import { v0_1_0_1 } from './v0.1.0_1'
import { v0_1_0_2 } from './v0.1.0_2'
import { v0_1_0_3 } from './v0.1.0_3'

export const versionGraph = VersionGraph.of({
  current: v0_1_0_3,
  other: [v0_1_0_0, v0_1_0_1, v0_1_0_2],
})
