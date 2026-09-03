import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Bucket URL, re-exported below as NEXT_PUBLIC_R2_URL so Next inlines it into
// client bundles.
const r2Url = (process.env.cloudflare_r2 ?? '').replace(/\/$/, '')

const r2Hostname = (() => {
  try {
    return r2Url ? new URL(r2Url).hostname : ''
  } catch {
    return ''
  }
})()

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_R2_URL: r2Url,
  },
  images: {
    // Next 16 only serves qualities declared here; 82 is used by the hero photo.
    qualities: [75, 82],
    remotePatterns: r2Hostname ? [{ protocol: 'https', hostname: r2Hostname }] : [],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        // Static assets in /public. The template shipped only the Payload media
        // pattern, which blocks next/image from optimising anything else local.
        pathname: '/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
