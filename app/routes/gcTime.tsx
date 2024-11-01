import { Link, createFileRoute } from '@tanstack/react-router'
import Chat from '~/components/Chat'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'

export const Route = createFileRoute('/gcTime')({
  component: QueryCaching,
})

export default function QueryCaching() {
  const [channel, setChannel] = useState('sf')
  const [open, setOpen] = useState(false)
  if (typeof window !== 'undefined') {
    ;(window as any).setOpen = setOpen
  }

  return (
    <>
      <h2>Maintaining subscriptions to queries</h2>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2  ">
        <div>
          <p className="mt-0">
            When the last component subscribed to a given Convex query unmounts
            that subscription can be dropped. But it's often useful to keep that
            subscription around for while!
          </p>
          <p>
            For fetch requests the React Query option{' '}
            <a href="https://tanstack.com/query/latest/docs/framework/react/guides/caching">
              <code>gcTime</code>
            </a>{' '}
            is the length of time to hold on to a stale result before dropping
            it out of cache. Convex queries use the same parameter to mean how
            long to stay subscribed to the query. This way Convex query results
            are always consistent, are never stale.
          </p>
          <p>
            <Button
              variant="link"
              onClick={() => {
                const element = document.querySelector(
                  '[aria-label="Open Tanstack query devtools"]',
                )
                element?.dispatchEvent(
                  new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                  }),
                )
              }}
            >
              Open the React Query devtools
            </Button>{' '}
            to see these query subscriptions stick around as you click between
            chat channels. These queries use a <code>gcTime</code> of 10
            seconds. If you want subscriptions to be dropped immediately use a{' '}
            <code>gcTime</code> of 0.
          </p>
        </div>
        <Card className="not-prose">
          <CardHeader>
            <div className="flex space-x-4">
              <Button
                className={channel === 'sf' ? 'bg-slate-400' : ''}
                onClick={() => setChannel('sf')}
              >
                SF
              </Button>
              <Button
                className={channel === 'nyc' ? 'bg-slate-400' : ''}
                onClick={() => setChannel('nyc')}
              >
                NYC
              </Button>
              <Button
                className={channel === 'seattle' ? 'bg-slate-400' : ''}
                onClick={() => setChannel('seattle')}
              >
                Seattle
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="py-4 rounded-md">
              <Chat useSuspense={false} channel={channel} />
            </div>
          </CardContent>
        </Card>
        <p>
          Since client-side navigations in TanStack Start retain the Query
          Client, these query subscriptions remain active from previous pages as
          well. When debugging why data is loaded or not it's good to keep this
          in mind. To get more prescriptive about data being available ahead of
          time you might add the query to a <Link to="/loaders">loader</Link>.
        </p>
      </div>
      <ReactQueryDevtools initialIsOpen={open} />
    </>
  )
}
