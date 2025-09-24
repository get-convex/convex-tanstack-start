import { createFileRoute } from '@tanstack/react-router'
import Chat from '~/components/Chat'
import CodeSample from '../../components/CodeSample'

export const Route = createFileRoute('/loaders/no-loader')({
  component: Messages,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      cacheBust: typeof search.cacheBust === 'string' ? search.cacheBust : '',
    }
  },
})

function Messages() {
  const { cacheBust } = Route.useSearch()
  return (
    <div>
      <Chat
        channel="nyc"
        gcTime={10000}
        useSuspense={false}
        cacheBust={cacheBust}
      />
      <div className="mt-4">
        <CodeSample
          code={`export const Route = createFileRoute('/loaders/no-loader')({
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
