import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:12',
  releaseNotes: {
    en_US:
      'Flash subscriptions can now be checked against Flash itself: add a Flash API key in Configure and Readstr recovers from dropped or out-of-order webhooks. Also hardens the server against oversized requests and reduces how many requests the reader sends when marking items read. Signed-in data is no longer cached by the browser.',
    es_ES:
      'Las suscripciones de Flash ahora pueden comprobarse con el propio Flash: añade una clave API de Flash en Configurar y Readstr se recupera de webhooks perdidos o desordenados. También refuerza el servidor frente a solicitudes demasiado grandes y reduce las solicitudes que envía el lector al marcar elementos como leídos. El navegador ya no guarda en caché los datos de la sesión iniciada.',
    de_DE:
      'Flash-Abonnements können jetzt direkt bei Flash geprüft werden: Hinterlege unter Konfigurieren einen Flash-API-Schlüssel, und Readstr behebt verlorene oder in falscher Reihenfolge eintreffende Webhooks. Außerdem ist der Server besser gegen übergroße Anfragen geschützt, und der Reader sendet beim Markieren als gelesen weniger Anfragen. Daten angemeldeter Nutzer werden nicht mehr im Browser zwischengespeichert.',
    pl_PL:
      'Subskrypcje Flash można teraz sprawdzać bezpośrednio we Flash: dodaj klucz API Flash w Konfiguracji, a Readstr naprawi utracone lub nieuporządkowane webhooki. Wzmacnia też serwer przed zbyt dużymi żądaniami i zmniejsza liczbę żądań wysyłanych przy oznaczaniu elementów jako przeczytane. Dane zalogowanego użytkownika nie są już przechowywane w pamięci podręcznej przeglądarki.',
    fr_FR:
      'Les abonnements Flash peuvent désormais être vérifiés auprès de Flash : ajoutez une clé API Flash dans Configurer et Readstr corrige les webhooks perdus ou reçus dans le désordre. Renforce aussi le serveur contre les requêtes trop volumineuses et réduit le nombre de requêtes envoyées par le lecteur lors du marquage comme lu. Les données de session ne sont plus mises en cache par le navigateur.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
