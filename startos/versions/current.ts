import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:8',
  releaseNotes: {
    en_US:
      'Security update: upgrades Next.js to 16.4.6, fixing several critical remote code execution vulnerabilities, and updates the HTTP client used to fetch feeds.',
    es_ES:
      'Actualización de seguridad: actualiza Next.js a 16.4.6, corrigiendo varias vulnerabilidades críticas de ejecución remota de código, y actualiza el cliente HTTP usado para obtener los feeds.',
    de_DE:
      'Sicherheitsupdate: aktualisiert Next.js auf 16.4.6, wodurch mehrere kritische Sicherheitslücken zur Remotecodeausführung behoben werden, und aktualisiert den HTTP-Client, mit dem Feeds abgerufen werden.',
    pl_PL:
      'Aktualizacja bezpieczeństwa: aktualizuje Next.js do wersji 16.4.6, usuwając kilka krytycznych luk umożliwiających zdalne wykonanie kodu, oraz aktualizuje klienta HTTP używanego do pobierania kanałów.',
    fr_FR:
      'Mise à jour de sécurité : met à niveau Next.js vers la version 16.4.6, corrigeant plusieurs vulnérabilités critiques d’exécution de code à distance, et met à jour le client HTTP utilisé pour récupérer les flux.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
