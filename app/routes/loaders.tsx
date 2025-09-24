import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/loaders')({
  component: BlockingAndStreaming,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      cacheBust:
        typeof search.cacheBust === 'string' ? search.cacheBust : 'abcd',
    }
  },
})

function rand() {
  return `cb${Math.random().toString(16).substring(2, 6)}`
}

export default function BlockingAndStreaming() {
  const { cacheBust: initialCacheBust } = Route.useSearch()
  const [cacheBust, setCacheBust] = useState(initialCacheBust)
  return (
    <>
      <h2 className="mt-0">Loaders and Prefetching</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="mt-0">
            TanStack Start routes can have isomorphic loader functions that run
            on the server for the initial pageload and on the client for
            subsequent client-side navigations.
          </p>
          <p>
            These three links navigate to subpages that show chat messages from
            different channels. Notice how client navigations between these
            pages work differently.
          </p>

          <p>
            Awaiting <code>ensureQueryData</code> will block rendering of the
            page until that data is available and calling{' '}
            <code>prefetchQuery</code> will start the request but not block.
            Loaders also run during prefetching, triggered by the cursor mousing
            onto a link in TanStack Start by default.
          </p>

          <nav className="flex flex-col space-y-4 mb-4 not-prose">
            <Button asChild>
              <Link
                to="/loaders/ensure"
                search={{ cacheBust }}
                onClick={() => setCacheBust(rand())}
              >
                <code>await queryClient.ensureQueryData</code> blocks for data
                and preloads on mouseenter
              </Link>
            </Button>
            <Button asChild>
              <Link
                to="/loaders/prefetch"
                search={{ cacheBust }}
                onClick={() => setCacheBust(rand())}
              >
                <code>queryClient.prefetchQuery()</code> loads on mouseenter but
                doesn't block
              </Link>
            </Button>
            <Button asChild>
              <Link
                to="/loaders/no-loader"
                search={{ cacheBust }}
                onClick={() => setCacheBust(rand())}
              >
                no loader, so mouseover does nothing
              </Link>
            </Button>
          </nav>

          <h3>When to use a loader</h3>
          <p>
            Loading a query in a loader ejects from the convenience of
            component-local reasoning through <code>useSuspenseQuery</code>{' '}
            where a component fetching its own data to the cold reality of fast
            page loads when you need it.
          </p>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
      <h2>Learn More</h2>
      <p>
        Tanner's{' '}
        <a href="https://www.youtube.com/watch?v=AuHqwQsf64o">
          An Early Glimpse of TanStack Start
        </a>{' '}
        video
      </p>
      <p>
        <a href="https://tanstack.com/router/latest/docs/framework/react/guide/preloading">
          TanStack Router Preloading Guide
        </a>
      </p>
    </>
  )
}
