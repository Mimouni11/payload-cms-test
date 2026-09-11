import type { ContactProps } from './types'

/**
 * Transcribed from the design. The form is a mock — nothing is submitted
 * anywhere yet, see the note in Form.tsx.
 */
export const contactPlaceholder: ContactProps = {
  headingLines: ['Envoyer un message.'],
  map: {
    query: 'Rue Fatma Ezzahra, Ariana, Tunisie',
    label: 'Carte — Rue Fatma Ezzahra, Ariana, Tunisie',
  },
  fields: {
    name: { label: 'Nom et prénom', placeholder: 'John doe' },
    company: { label: 'Société', placeholder: 'Nom de votre entreprise' },
    email: { label: 'Email', placeholder: 'John@email.com' },
    message: {
      label: 'Message',
      placeholder: 'Type d’espace, surface approximative, délai souhaité, services recherchés...',
    },
  },
  servicesLabel: 'Service(s) concerné(s)',
  services: [
    'Cloisonnement',
    'Signalétique',
    'Traitement du vitrage',
    'Habillage de surface',
    'Agencement',
    'Personnalisation',
  ],
  submitLabel: 'Envoyer ma demande',
  details: [
    { label: 'Adresse', value: 'Rue Fatma Ezzahra, Ariana Tunisie', icon: 'location' },
    { label: 'Téléphone', value: '+216 31 536 548', icon: 'phone' },
    { label: 'Email', value: 'contact@groupebigart.tn', icon: 'mail' },
    { label: 'Horaires', value: 'Lun. Ven. 8h00 à 17h30', icon: 'clock' },
  ],
}
