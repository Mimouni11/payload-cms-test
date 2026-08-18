import type { CollectionConfig } from 'payload'

export const Trips: CollectionConfig = {
  slug: 'trips',
  access: {
    // The public site reads these — everything else requires a login.
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'place',
    defaultColumns: ['place', 'country', 'price', 'nights', 'order'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'place',
          type: 'text',
          required: true,
          label: 'Destination',
          admin: { width: '50%', placeholder: 'Santorini' },
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          admin: { width: '50%', placeholder: 'Greece' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      label: 'Card summary',
      admin: { description: 'One or two lines. Shown on the card, keep it under ~120 characters.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: 'Price (€, per person)',
          admin: { width: '33%' },
        },
        {
          name: 'nights',
          type: 'number',
          required: true,
          min: 1,
          admin: { width: '33%' },
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 0,
          max: 5,
          defaultValue: 4.8,
          admin: { width: '33%', step: 0.1 },
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Card photo',
      admin: { description: 'Optional. Falls back to the colour treatment below when empty.' },
    },
    {
      name: 'tone',
      type: 'select',
      required: true,
      defaultValue: 'aegean',
      label: 'Colour treatment',
      options: [
        { label: 'Aegean (blue)', value: 'aegean' },
        { label: 'Blossom (pink)', value: 'blossom' },
        { label: 'Sahara (amber)', value: 'sahara' },
      ],
      admin: { description: 'Used when there is no photo.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Sort order',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
