import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { defaultRelays } from '../utils'

const { InputSpec, Value, List } = sdk

const relayPattern = {
  regex: '^wss://.+',
  description: 'Relay URLs must start with wss://',
}

const inputSpec = InputSpec.of({
  defaultRelays: Value.list(
    List.text(
      {
        name: i18n('Default Relays'),
        description: i18n(
          'Nostr relays used to fetch long-form content and profiles',
        ),
        default: defaultRelays,
      },
      { patterns: [relayPattern], placeholder: 'wss://nos.lol' },
    ),
  ),
  nip98AllowedHosts: Value.text({
    name: i18n('Allowed Hosts'),
    description: i18n(
      'Comma-separated hostnames clients use to reach this server (required for login when not using the default host). Leave blank to use the app default.',
    ),
    required: false,
    default: null,
  }),
})

export const configure = sdk.Action.withInput(
  'configure',
  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n('Configure the Nostr relays and allowed hosts'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  inputSpec,
  async ({ effects }) => {
    const s = await storeJson.read().once()
    return {
      defaultRelays: s?.defaultRelays ?? defaultRelays,
      nip98AllowedHosts: s?.nip98AllowedHosts || null,
    }
  },
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      defaultRelays: input.defaultRelays,
      nip98AllowedHosts: input.nip98AllowedHosts ?? '',
    })
    await effects.restart()
    return {
      version: '1' as const,
      title: i18n('Configuration saved'),
      message: i18n('The service is restarting with the new settings.'),
      result: null,
    }
  },
)
