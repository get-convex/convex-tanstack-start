import { Link, createFileRoute } from '@tanstack/react-router'
import CodeSample from '~/components/CodeSample'
import Chat from '~/components/Chat'
import { Button } from '~/components/ui/button'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ReloadIcon } from '@radix-ui/react-icons'

export const Route = createFileRoute('/react-query')({
  component: ReactQuery,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery({
      ...convexQuery(api.messages.isSimulatingTraffic, {}),
      gcTime: 2000,
    })
  },
})

export default function ReactQuery() {
  const sendTraffic = useConvexMutation(api.messages.simulateTraffic)
  const { data: simulationRunning } = useSuspenseQuery({
    ...convexQuery(api.messages.isSimulatingTraffic, {}),
    gcTime: 2000,
  })
  return (
    <>
      <h2>Using React Query hooks for data from Convex</h2>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2  ">
        <div>
          <p className="mt-0">
            TanStack Start apps can use React Query (TanStack Query for React)
            hooks to take advantage of React Query's excellent Start
            integration. Convex queries are exposed through{' '}
            <a href="https://tkdodo.eu/blog/the-query-options-api">
              query options factories
            </a>{' '}
            like{' '}
            <a href="https://docs.convex.dev/client/tanstack-query#queries">
              <code>convexQuery()</code>
            </a>
            .
          </p>
          <p>
            Instead of React Query's standard interval and activity-based
            polling and manual invalidation, updates are streamed down WebSocket
            to update the Query Cache directly for live, always-up-to-date
            results.
          </p>
          <p>
            Open this page in another tab or on your phone and send a message or{' '}
            <Button
              variant="link"
              className="text-md px-0 underline"
              onClick={() => sendTraffic()}
            >
              simulate chat traffic{' '}
              {simulationRunning ? (
                <ReloadIcon className="h-4 w-4 animate-spin inline" />
              ) : null}
            </Button>{' '}
            to see these updates pushed live.{' '}
          </p>
          <Chat useSuspense={false} />
        </div>
        <div>
          <CodeSample
            code={`import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../convex/_generated/api";

const messagesQuery = convexQuery(
  api.messages.listMessages,
  { channel: "chatty" }
)

// inside a React component
const { data, isPending } = useQuery(messagesQuery);

// in an event handler, useEffect, or loader
queryClient.prefetchQuery(messagesQuery);

// adding more query options to convexQuery()
const { data } = useQuery({
  ...convexQuery(api.messages.listMessages, {}),
  initialData: [],
  gcTime: 10000,
});`}
          />
        </div>
      </div>

      <h2>Already used Convex React hooks?</h2>
      <p>
        If you've used Convex React hooks React Query hooks are going to
        familiar. Instead of returning the data directly, this{' '}
        <code>useQuery()</code> returns an object with a <code>.data</code>{' '}
        property along with other metadata. The hook accepts a single object,
        which you'll mostly populate with the return value of the{' '}
        <code>convexQuery()</code> hook.
      </p>
      <p>
        The same React Query hooks can be used for fetch endpoints and Convex
        actions for standard interval or activity-based polling while Convex
        queries benefit from the live update behavior.
      </p>
      <p>
        What does this give you? It's not just the often-asked-for{' '}
        <code>isLoading</code> and <code>error</code> properties or simple
        interop with other server endpoints or introspection from the TanStack
        Query devtools. It's React Query's Router integration with the TanStack
        Start providing things like{' '}
        <Link to="/ssr">server-side rendering and live updating queries</Link>{' '}
        in a single hook.
      </p>

      <h2>Learn More</h2>
      <p>
        <a href="https://tanstack.com/query/latest/docs/framework/react/overview">
          TanStack Query (AKA React Query) docs
        </a>
      </p>
      <p>
        Using{' '}
        <a href="https://docs.convex.dev/client/tanstack-query#differences-from-using-fetch-with-tanstack-query">
          TanStack Query with Convex
        </a>
      </p>
      <p>
        The{' '}
        <a href="https://github.com/get-convex/convex-react-query">
          @convex-dev/react-query
        </a>{' '}
        library links the TanStack Query Client with the Convex client
      </p>
    </>
  )
}
