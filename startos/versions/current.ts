import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:9',
  releaseNotes: {
    en_US:
      'Security update: the API now limits request sizes and rate-limits requests per IP address, and Flash subscription webhooks are verified by their signature. To accept Flash subscriptions, set the Flash checkout URL and webhook secret in Configure. The database is upgraded automatically on first start to track Flash subscriptions. The Default Relays set in Configure now take effect.',
    es_ES:
      'Actualización de seguridad: la API ahora limita el tamaño de las solicitudes y la frecuencia de solicitudes por dirección IP, y los webhooks de suscripción de Flash se verifican mediante su firma. Para aceptar suscripciones de Flash, indica la URL de pago y el secreto del webhook de Flash en Configurar. La base de datos se actualiza automáticamente en el primer arranque para registrar las suscripciones de Flash. Los relés predeterminados indicados en Configurar ahora se aplican.',
    de_DE:
      'Sicherheitsupdate: Die API begrenzt jetzt die Größe von Anfragen und die Anzahl der Anfragen pro IP-Adresse, und Flash-Abonnement-Webhooks werden anhand ihrer Signatur geprüft. Um Flash-Abonnements anzunehmen, trage die Flash-Checkout-URL und das Webhook-Secret unter Konfigurieren ein. Die Datenbank wird beim ersten Start automatisch aktualisiert, um Flash-Abonnements zu erfassen. Die unter Konfigurieren festgelegten Standard-Relays werden jetzt angewendet.',
    pl_PL:
      'Aktualizacja bezpieczeństwa: API ogranicza teraz rozmiar żądań i liczbę żądań z jednego adresu IP, a webhooki subskrypcji Flash są weryfikowane na podstawie podpisu. Aby przyjmować subskrypcje Flash, ustaw adres URL płatności i sekret webhooka Flash w Konfiguruj. Baza danych jest automatycznie aktualizowana przy pierwszym uruchomieniu, aby śledzić subskrypcje Flash. Domyślne przekaźniki ustawione w Konfiguruj są teraz faktycznie używane.',
    fr_FR:
      'Mise à jour de sécurité : l’API limite désormais la taille des requêtes et le nombre de requêtes par adresse IP, et les webhooks d’abonnement Flash sont vérifiés grâce à leur signature. Pour accepter les abonnements Flash, renseignez l’URL de paiement et le secret du webhook Flash dans Configurer. La base de données est mise à niveau automatiquement au premier démarrage pour suivre les abonnements Flash. Les relais par défaut définis dans Configurer sont désormais appliqués.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
