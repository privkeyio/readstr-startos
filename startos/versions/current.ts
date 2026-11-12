import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:10',
  releaseNotes: {
    en_US:
      'Fixes Flash subscriptions: cancelling now keeps access until the end of the period already paid for, and events from an old subscription can no longer end a newer one.',
    es_ES:
      'Corrige las suscripciones de Flash: al cancelar se mantiene el acceso hasta el final del periodo ya pagado, y los eventos de una suscripción antigua ya no pueden terminar una más reciente.',
    de_DE:
      'Behebt Fehler bei Flash-Abonnements: Nach einer Kündigung bleibt der Zugang bis zum Ende des bereits bezahlten Zeitraums erhalten, und Ereignisse eines alten Abonnements können ein neueres nicht mehr beenden.',
    pl_PL:
      'Poprawki subskrypcji Flash: anulowanie zachowuje dostęp do końca już opłaconego okresu, a zdarzenia ze starej subskrypcji nie mogą już zakończyć nowszej.',
    fr_FR:
      'Corrige les abonnements Flash : une résiliation conserve l’accès jusqu’à la fin de la période déjà payée, et les événements d’un ancien abonnement ne peuvent plus mettre fin à un abonnement plus récent.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
