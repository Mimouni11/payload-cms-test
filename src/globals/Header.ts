import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Navigation',
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
      autosave: { interval: 200 },
      schedulePublish: true,
    },
    max: 30,
  },
  fields: [
    {
      name: 'brand',
      type: 'text',
      required: true,
      label: 'Brand name',
      defaultValue: 'Meridian',
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Menu items',
      maxRows: 6,
      labels: { singular: 'Menu item', plural: 'Menu items' },
      admin: {
        description: 'Drag to reorder. Untick "Visible" to pull one without deleting it.',
      },
      defaultValue: [
        {
          label: 'Destinations',
          href: '#',
          enabled: true,
          dropdown: [
            { label: 'Mediterranean', blurb: 'Greece, Italy, Croatia', href: '#', enabled: true },
            { label: 'Southeast Asia', blurb: 'Thailand, Vietnam, Bali', href: '#', enabled: true },
            { label: 'North Africa', blurb: 'Morocco, Egypt, Tunisia', href: '#', enabled: true },
            { label: 'Patagonia', blurb: 'Chile & Argentina', href: '#', enabled: true },
            { label: 'Nordics', blurb: 'Iceland, Norway, Faroes', href: '#', enabled: true },
          ],
        },
        { label: 'Journeys', href: '#catalogue', enabled: true },
        { label: 'About', href: '#', enabled: true },
        { label: 'Contact', href: '#', enabled: true },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '45%' } },
            {
              name: 'href',
              type: 'text',
              defaultValue: '#',
              label: 'Link',
              admin: { width: '35%' },
            },
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Visible',
              admin: { width: '20%' },
            },
          ],
        },
        {
          name: 'dropdown',
          type: 'array',
          label: 'Dropdown entries',
          maxRows: 10,
          labels: { singular: 'Entry', plural: 'Entries' },
          admin: {
            description:
              'Leave empty for a plain link. Add rows to turn this item into a dropdown menu.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                {
                  name: 'blurb',
                  type: 'text',
                  label: 'Sub-label',
                  admin: { width: '40%', placeholder: 'Greece, Italy, Croatia' },
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Visible',
                  admin: { width: '20%' },
                },
              ],
            },
            { name: 'href', type: 'text', defaultValue: '#', label: 'Link' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Call-to-action button',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'ctaLabel',
              type: 'text',
              defaultValue: 'Book a call',
              label: 'Label',
              admin: { width: '40%' },
            },
            {
              name: 'ctaHref',
              type: 'text',
              defaultValue: '#',
              label: 'Link',
              admin: { width: '35%' },
            },
            {
              name: 'ctaEnabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Visible',
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
  ],
}
