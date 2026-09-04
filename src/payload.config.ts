import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ExpertisesGlobal } from './blocks/Expertises/config'

// R2 speaks the S3 API. Only enabled when credentials exist, so local dev
// without them keeps writing uploads to disk instead of failing at boot.
const r2Configured = Boolean(
  process.env.R2_BUCKET && process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID,
)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media],
  globals: [ExpertisesGlobal],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Postgres in production — Vercel's filesystem is ephemeral, so a SQLite file
  // would be wiped on every deploy. Picked from the connection string itself so
  // there is no second flag to keep in sync; local dev stays on SQLite.
  db: process.env.DATABASE_URL?.startsWith('postgres')
    ? postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URL },
      })
    : sqliteAdapter({
        client: { url: process.env.DATABASE_URL || '' },
      }),
  sharp,
  plugins: r2Configured
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.R2_BUCKET as string,
          config: {
            endpoint: process.env.R2_ENDPOINT,
            // R2 ignores regions but the S3 client requires one.
            region: 'auto',
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            },
          },
        }),
      ]
    : [],
})
