import type { CollectionConfig } from 'payload'

import { GROUP } from '@/admin/i18n'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { fr: 'Utilisateur', en: 'User' },
    plural: { fr: 'Utilisateurs', en: 'Users' },
  },
  admin: {
    group: GROUP.admin,
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
