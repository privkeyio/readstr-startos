import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'readstr',
  title: 'Readstr',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/readstr-startos',
  upstreamRepo: 'https://github.com/privkeyio/readstr',
  marketingUrl: 'https://github.com/privkeyio/readstr',
  donationUrl: null,
  description: {
    short,
    long,
  },
  volumes: ['main', 'db'],
  images: {
    readstr: {
      source: {
        dockerBuild: {
          workdir: './readstr',
          dockerfile: './Dockerfile',
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: {
        dockerTag: 'postgres:16-alpine',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
