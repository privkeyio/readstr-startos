import { sdk } from './sdk'
import { i18n } from './i18n'
import { uiPort } from './utils'

// Host id (the `sdk.MultiHost.of` group) vs. the interface id exported on it —
// they differ here, so keep both for `sdk.host.getOwn` lookups.
export const uiHostId = 'ui-multi'
export const uiInterfaceId = 'ui'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, uiHostId)
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: uiInterfaceId,
    description: i18n(
      'Browse your RSS feeds, Nostr long-form content, and video subscriptions',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui])

  return [uiReceipt]
})
