import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:13',
  releaseNotes: {
    en_US:
      'Signing out now clears your data from the browser, including AI settings and their API key, reading history, saved views and cached images, and other open tabs follow along. Signing in as a different account on the same browser also starts clean. Profile search no longer lets the server connect to private or internal addresses, and limits how many connections and lookups each search can use.',
    es_ES:
      'Al cerrar sesión ahora se borran tus datos del navegador, incluidos los ajustes de IA y su clave API, el historial de lectura, las vistas guardadas y las imágenes en caché, y las demás pestañas abiertas también se actualizan. Iniciar sesión con otra cuenta en el mismo navegador también empieza desde cero. La búsqueda de perfiles ya no permite que el servidor se conecte a direcciones privadas o internas, y limita cuántas conexiones y consultas usa cada búsqueda.',
    de_DE:
      'Beim Abmelden werden deine Daten jetzt aus dem Browser gelöscht, darunter KI-Einstellungen samt API-Schlüssel, Leseverlauf, gespeicherte Ansichten und zwischengespeicherte Bilder, und andere offene Tabs ziehen mit. Wer sich im selben Browser mit einem anderen Konto anmeldet, beginnt ebenfalls ohne fremde Daten. Die Profilsuche kann den Server nicht mehr mit privaten oder internen Adressen verbinden und begrenzt, wie viele Verbindungen und Abfragen jede Suche nutzt.',
    pl_PL:
      'Wylogowanie usuwa teraz Twoje dane z przeglądarki, w tym ustawienia AI wraz z kluczem API, historię czytania, zapisane widoki i obrazy w pamięci podręcznej, a pozostałe otwarte karty również się aktualizują. Zalogowanie się innym kontem w tej samej przeglądarce także zaczyna od czystego stanu. Wyszukiwanie profili nie pozwala już serwerowi łączyć się z adresami prywatnymi ani wewnętrznymi i ogranicza liczbę połączeń i zapytań na jedno wyszukiwanie.',
    fr_FR:
      'La déconnexion efface désormais vos données du navigateur, y compris les réglages IA et leur clé API, l’historique de lecture, les vues enregistrées et les images en cache, et les autres onglets ouverts suivent. Se connecter avec un autre compte dans le même navigateur repart aussi de zéro. La recherche de profils ne permet plus au serveur de se connecter à des adresses privées ou internes, et limite le nombre de connexions et de requêtes par recherche.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
