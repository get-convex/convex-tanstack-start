import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  Outlet,
  Link,
} from '@tanstack/react-router'
import * as React from 'react'
import appCss from '~/styles/app.css?url'
import { cn } from '~/lib/utils'
import { QueryClient } from '@tanstack/react-query'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'TanStack Start Starter',
        },
      ],
      links: [{ rel: 'stylesheet', href: appCss }],
    }),
    component: RootComponent,
  },
)

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <RootLayout>{children}</RootLayout>
        <Scripts />
      </body>
    </html>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseClasses = 'pb-1 font-medium px-3 py-2 transition-colors rounded-md'
  const activeProps = {
    className: cn(baseClasses, 'bg-slate-700'),
  } as const
  const inactiveProps = {
    className: cn(baseClasses, 'hover:bg-slate-800'),
  } as const
  const linkProps = { inactiveProps, activeProps } as const
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto py-4 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
          <Link to="/">
            <h1 className="text-2xl font-bold">Convex with TanStack Start</h1>
          </Link>
          <nav className="flex xl:items-center gap-4 flex-col xl:flex-row items-start">
            <ul className="flex gap-4 xl:flex-row flex-col xl:gap-1">
              <li>
                <Link to="/react-query" {...linkProps}>
                  React Query hooks
                </Link>
              </li>
              <li>
                <Link to="/ssr" {...linkProps}>
                  SSR and Live Queries
                </Link>
              </li>
              <li>
                <Link to="/gcTime" {...linkProps}>
                  Staying subscribed
                </Link>
              </li>
              <li>
                <Link
                  to="/loaders"
                  search={{ cacheBust: 'initial' }}
                  {...linkProps}
                >
                  Loaders
                </Link>
              </li>
            </ul>
            <a
              href="https://github.com/get-convex/convex-tanstack-start/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-slate-800 transition-colors inline-flex items-center gap-2 font-medium"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-slate-300 hover:text-white"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="xl:sr-only">View on GitHub</span>
            </a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 prose-xl prose-slate prose-headings:font-bold prose-ol:pl-0 prose-li:pl-0 prose-a:underline prose-a:underline-offset-3 prose-p:leading-snug transition-colors prose-a:hover:text-white">
        {children}
      </main>
    </div>
  )
}
