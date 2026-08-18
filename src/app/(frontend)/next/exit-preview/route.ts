import { draftMode } from 'next/headers'

export async function GET(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()

  return new Response('Draft mode disabled — you are seeing published content again.')
}
