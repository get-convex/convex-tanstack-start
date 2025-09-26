import { Link, createFileRoute } from '@tanstack/react-router'
import CodeSample from '~/components/CodeSample'
import Chat from '~/components/Chat'
import { Button } from '~/components/ui/button'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { ReloadIcon } from '@radix-ui/react-icons'

export const Route = createFileRoute('/ssr')({
  component: LiveQueriesSSR,
})

export default function LiveQueriesSSR() {
  const sendTraffic = useConvexMutation(api.messages.simulateTraffic)
  const { data: simulationRunning } = useSuspenseQuery({
    ...convexQuery(api.messages.isSimulatingTraffic, {}),
    gcTime: 2000,
  })

  return (
    <>
      <h2>Server-Side Rendering and Live Queries</h2>
      <p>
        TanStack Start routes render on the server for the first pageload of a
        browsing session. Neither the React Query nor standard Convex{' '}
        <code>useQuery()</code> hooks kick off requests for this data during
        this initial SSR pass, but the React Query hook{' '}
        <code>useSuspenseQuery()</code> does. The React Query client is then
        serialized with whatever data was loaded to make it available in the
        browser at hydration time. This reduces rendering on the server and
        updating on the client from{' '}
        <a href="https://docs.convex.dev/client/react/nextjs/server-rendering#preloading-data-for-client-components">
          two steps
        </a>{' '}
        to one step: isomorphic data fetching with a single hook.
      </p>
      <p>
        Try{' '}
        <a
          href="./"
          onClick={(e) => {
            e.preventDefault()
            window.location.reload()
          }}
        >
          reloading
        </a>{' '}
        this page to see the difference between <code>useSuspenseQuery()</code>{' '}
        and <code>useQuery()</code>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Chat
          useSuspense={true}
          cacheBust={'left ssr example'}
          codeToShow={`const { data } = useSuspenseQuery(convexQuery(
  api.messages.listMessages,
  { channel: "chatty" }
))`}
        />
        <Chat
          useSuspense={false}
          cacheBust={'right ssr example'}
          codeToShow={`const { data, isPending } = useQuery(convexQuery(
  api.messages.listMessages,
  { channel: "chatty" }
))`}
        />
      </div>

      <p>
        On the browser these queries resume their subscriptions which you can
        see by{' '}
        <Button
          variant="link"
          className="text-md px-0 underline"
          onClick={() => sendTraffic()}
        >
          simulating chat traffic{' '}
          {simulationRunning ? (
            <ReloadIcon className="h-4 w-4 animate-spin inline" />
          ) : null}
        </Button>
        .
      </p>
      <p>
        Another way to opt into server-side data loading is to load the query in
        a{' '}
        <Link to="/loaders" search={{ cacheBust: 'initial' }}>
          loader
        </Link>
        .
      </p>
      <h2>Learn More</h2>

      <p>
        <a href="https://tanstack.com/router/latest/docs/framework/react/start/ssr">
          TanStack Start SSR Guide
        </a>
      </p>
    </>
  )
}
