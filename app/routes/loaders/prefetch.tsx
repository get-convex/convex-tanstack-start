import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import Chat from '~/components/Chat'
import CodeSample from '../../components/CodeSample'

export const Route = createFileRoute('/loaders/prefetch')({
  component: Messages,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      cacheBust: typeof search.cacheBust === 'string' ? search.cacheBust : '',
    }
  },
  loaderDeps: ({ search: { cacheBust } }) => ({ cacheBust }),
  loader: async ({ deps: { cacheBust }, context }) => {
    context.queryClient.prefetchQuery({
      ...convexQuery(api.messages.listMessages, {
        channel: 'seattle',
        cacheBust,
      }),
      gcTime: 10000,
    })
  },
})

function Messages() {
  const { cacheBust } = Route.useSearch()
  return (
    <div>
      <Chat
        channel="seattle"
        cacheBust={cacheBust}
        gcTime={10000}
        useSuspense={false}
      />
      <div className="mt-4">
        <CodeSample
          code={`export const Route = createFileRoute('/loaders/prefetch')({
  loader: async (opts) => {
    await opts.context.queryClient.prefetchQuery(
      convexQuery(api.messages.list, {}),
    );
  },
  component: () => {
    const { data } = useQuery(
      convexQuery(api.messages.list, {})
    );
  },
})`}
        />
      </div>
    </div>
  )
}
