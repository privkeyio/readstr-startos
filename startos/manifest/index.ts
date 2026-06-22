import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'readstr',
  title: 'Readstr',
  license: 'MIT',
  packageRepo: 'https://github.com/privkeyio/readstr-startos',
  upstreamRepo: 'https://github.com/privkeyio/readstr',
  marketingUrl: 'https://github.com/privkeyio/readstr',
  donationUrl: null,
  description: {
    short,
    long,
  },
  volumes: ['main'],
  images: {
    readstr: {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
