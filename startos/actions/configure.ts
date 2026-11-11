import { z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { defaultRelays } from '../utils'

const { InputSpec, Value, List } = sdk

const relayPattern = {
  regex: '^wss://.+',
  description: i18n('Relay URLs must start with wss://'),
}

const inputSpec = InputSpec.of({
  defaultRelays: Value.list(
    List.text(
      {
        name: i18n('Default Relays'),
        description: i18n(
          'The default Nostr relays Readstr uses to fetch long-form content and profiles. You can also manage relays within the app.',
        ),
        default: defaultRelays,
      },
      { patterns: [relayPattern], placeholder: 'wss://nos.lol' },
    ),
  ),
  nip98AllowedHosts: Value.list(
    List.text(
      {
        name: i18n('Allowed Hosts'),
        description: i18n(
          'Extra hostnames to accept for NIP-98 login, such as a custom domain you added. The addresses StartOS assigns this service are always allowed.',
        ),
        default: [],
      },
      { placeholder: 'readstr.example.com' },
    ),
  ),
  flashCheckoutUrl: Value.text({
    name: i18n('Flash Checkout URL'),
    description: i18n(
      'The Flash plan signup URL. Readstr appends ?ref=<pubkey> to it to identify the subscribing reader. Leave empty if you do not offer Flash subscriptions.',
    ),
    required: false,
    default: null,
    placeholder: 'https://',
    patterns: [
      {
        regex: '^https://\\S+$',
        description: i18n('Must be an https:// URL'),
      },
    ],
  }),
  flashWebhookSecret: Value.text({
    name: i18n('Flash Webhook Secret'),
    description: i18n(
      'The signing secret (whsec_…) of your Flash webhook endpoint. Readstr uses it to verify the Flash-Signature on every request to /api/webhooks/flash and rejects requests without a valid one.',
    ),
    required: false,
    default: null,
    masked: true,
    placeholder: 'whsec_…',
    patterns: [
      {
        regex: '^whsec_\\S+$',
        description: i18n('Must start with whsec_'),
      },
    ],
  }),
})

const orNull = (v: string | null | undefined) => v?.trim() || null

export const configure = sdk.Action.withInput(
  'configure',
  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n(
      'Configure the Nostr relays, allowed hosts and Flash payments',
    ),
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
      nip98AllowedHosts: s?.nip98AllowedHosts ?? [],
      flashCheckoutUrl: s?.flashCheckoutUrl ?? null,
      flashWebhookSecret: s?.flashWebhookSecret ?? null,
    }
  },
  async ({ effects, input }) => {
    if (
      input.flashCheckoutUrl &&
      !z.url().safeParse(input.flashCheckoutUrl).success
    ) {
      throw new Error(i18n('Must be an https:// URL'))
    }
    await storeJson.merge(effects, {
      defaultRelays: input.defaultRelays,
      nip98AllowedHosts: input.nip98AllowedHosts,
      flashCheckoutUrl: orNull(input.flashCheckoutUrl),
      flashWebhookSecret: orNull(input.flashWebhookSecret),
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
