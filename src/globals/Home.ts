import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    livePreview: {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/next/preview?secret=${
        process.env.PREVIEW_SECRET || ''
      }`,
    },
  },
  versions: {
    drafts: {
      // Short interval keeps the live-preview iframe feeling instant.
      autosave: { interval: 200 },
      schedulePublish: true,
    },
    max: 30,
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'gradient',
      label: 'Hero design',
      options: [
        { label: 'A — Gradient (left aligned)', value: 'gradient' },
        { label: 'B — Editorial (centered)', value: 'editorial' },
      ],
      admin: { description: 'Both designs use the same fields below.' },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      defaultValue: 'Small-group travel · Since 2011',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Headline',
          defaultValue: 'The world,',
          admin: { width: '60%' },
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Headline (italic part)',
          defaultValue: 'unhurried',
          admin: { width: '40%', description: 'Rendered in the gold italic.' },
        },
      ],
    },
    {
      name: 'lede',
      type: 'textarea',
      label: 'Intro paragraph',
      defaultValue:
        'We design slow, deliberate journeys for people who would rather see one place properly than six places badly. Twelve travellers maximum. No coaches, ever.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryCta',
          type: 'text',
          label: 'Primary button',
          defaultValue: 'Browse journeys',
          admin: { width: '50%' },
        },
        {
          name: 'secondaryCta',
          type: 'text',
          label: 'Secondary button',
          defaultValue: 'How we plan',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'statsEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show the stats row',
      admin: { description: 'Untick to hide it from the public site without deleting anything.' },
    },
    {
      name: 'statsShowAgainOn',
      type: 'date',
      label: 'Bring it back on',
      admin: {
        // Only asked for when the row is actually hidden.
        condition: (data) => data?.statsEnabled === false,
        description: 'Optional. Leave empty to keep it hidden until you tick the box again.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stats',
      maxRows: 4,
      admin: { description: 'Shown under the hero. Drag to reorder.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'value', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
}
