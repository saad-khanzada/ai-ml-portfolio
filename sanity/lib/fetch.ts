import 'server-only'

import {client} from './client'

const publishedClient = client.withConfig({
  perspective: 'published',
  useCdn: false,
  stega: false,
  timeout: 10000,
})

export class CmsFetchError extends Error {
  constructor() {
    super('CMS content is temporarily unavailable.')
    this.name = 'CmsFetchError'
  }
}

export async function fetchPublishedQuery<
  Q extends keyof SanityQueries & string,
>(
  query: Q,
  params: Record<string, string> = {},
): Promise<SanityQueries[Q]> {
  try {
    return await publishedClient.fetch<SanityQueries[Q]>(
      query,
      params,
      {
        next: {revalidate: 60},
      },
    )
  } catch {
    // A failed request must not masquerade as an empty CMS collection.
    // Keep upstream response details out of errors passed to the frontend.
    throw new CmsFetchError()
  }
}
