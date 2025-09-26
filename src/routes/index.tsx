import { Link, createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ExternalLinkIcon } from '@radix-ui/react-icons'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

export default function LandingPage() {
  const tools = [
    {
      name: 'TanStack Start',
      description:
        'A new React framework focused on routing, caching, and type safety.',
      href: 'https://tanstack.com/start',
    },
    {
      name: 'Convex',
      description:
        'A typesafe database that live-updates and automatically invalidates queries.',
      href: 'https://www.convex.dev/',
    },
    {
      name: 'TanStack Query',
      description:
        'Asynchronous state management for server-side state like queries and mutations. AKA React Query.',
      href: 'https://tanstack.com/query',
    },
  ]

  const features = [
    {
      title: 'Using React Query hooks',
      description: 'Supercharging React Query with live updates from Convex.',
      link: '/react-query',
    },
    {
      title: 'Render on the server, update in the browser',
      description:
        'Hydrating the Query Client in the browser makes SSR take no extra steps.',
      link: '/ssr',
    },
    {
      title: 'Staying subscribed to queries',
      description: "Data not currently rendered doesn't need to be stale.",
      link: '/gcTime',
    },
    {
      title: 'Loaders and prefetching',
      description:
        'Adding queries to loaders enables prefetching and can prevent waterfalls.',
      link: '/loaders',
    },
  ]

  return (
    <div className="flex flex-col gap-12">
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
        <h1 className="text-6xl font-bold text-balance text-white m-0">
          TanStack <span className="text-cyan-500">Start</span>, TanStack
          <span className="text-red-500"> Query</span>, and{' '}
          <span className="text-[#F3B01C]">Convex</span>
        </h1>
        <div className="flex flex-col gap-4 not-prose lg:row-start-2">
          <p className="text-xl font-light text-slate-300">
            TanStack Start is coming. The best way to use Convex with Start is
            via React Query's excellent Start integration. This site is{' '}
            <a href="https://github.com/get-convex/convex-tanstack-start/">
              written with Start
            </a>{' '}
            using this setup.
          </p>

          <p className="text-xl font-light text-slate-300">
            You can jump straight to the quickstart or read more to learn about
            using Convex with Start. There's a lot more to TanStack Start so
            also check out the{' '}
            <a href="https://tanstack.com/router/latest/docs/framework/react/start/overview">
              official Start guide
            </a>
            .{' '}
          </p>
        </div>
        <div className="flex flex-col not-prose text-slate-300 lg:row-start-2">
          <p className="text-sm font-medium">
            Try out TanStack Start with Convex:
          </p>
          <p className="text-2xl font-bold mb-8">
            <a href="https://docs.convex.dev/quickstart/tanstack-start">
              Convex TanStack Quickstart
            </a>
          </p>
          <p className="text-sm font-bold mb-2">Or run:</p>
          <p className="text-lg font-light">
            <code className="bg-slate-700 block px-4 py-2 rounded-md border border-slate-600">
              npm create convex@latest -- -t tanstack-start
            </code>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
        {features.map((feature, index) => (
          <Link key={index} to={feature.link}>
            <Card className="hover:bg-slate-800 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400 leading-tight text-base">
                {feature.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div>
        <p className="font-bold">Read more about these projects:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
          {tools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              target="_blank"
              rel="noreferrer"
            >
              <Card className="hover:bg-slate-800 transition-colors not-prose">
                <CardHeader className="relative mb-1">
                  <CardTitle className="text-3xl font-bold text-center">
                    {tool.name}
                  </CardTitle>
                  <ExternalLinkIcon className="w-4 h-4 absolute top-1 right-2 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <p className="text-center text-slate-400 leading-tight text-balance text-base">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
