import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { site } from "@/config/site";
import { reportLovableError } from "../lib/lovable-error-reporting";

const TERMINAL_BOOT_SCRIPT = `try{if(localStorage.getItem("cs-terminal-mode")==="1")document.documentElement.classList.add("terminal-mode")}catch(e){}`;

function NotFoundComponent() {
  return (
    <div className="zone-dark flex min-h-screen items-center justify-center px-4 py-12">
      <main className="term scanlines w-full max-w-xl" aria-labelledby="nf-title">
        <div className="term-bar">
          <span>uofa@colorstack:~/404</span>
          <span aria-hidden="true">[!][□][x]</span>
        </div>
        <div className="p-6 sm:p-8">
          <p className="mono mb-3 text-orange">ERR_LAYER_MISSING · EXIT 404</p>
          <h1 id="nf-title" className="font-display text-4xl leading-none font-black uppercase text-yellow sm:text-5xl">
            404: layer not found
          </h1>
          <pre className="mt-4 !p-0 text-sm text-slab-fg">
{`> ls ./routes
  /
> cat ./status
  That layer isn't in the stack. Head back to the chapter page.`}
          </pre>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link to="/" className="btn btn-outline whitespace-nowrap">
              $ cd /home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="zone-dark flex min-h-screen items-center justify-center px-4 py-12">
      <main className="term scanlines w-full max-w-xl" aria-labelledby="err-title">
        <div className="term-bar">
          <span>uofa@colorstack:~/panic</span>
          <span aria-hidden="true">[!][□][x]</span>
        </div>
        <div className="p-6 sm:p-8">
          <p className="mono mb-3 text-orange">ERR_STACK_FAULT · EXIT 500</p>
          <h1 id="err-title" className="font-display text-3xl leading-none font-black uppercase text-yellow sm:text-4xl">
            This layer crashed
          </h1>
          <p className="mt-4 text-sm text-slab-fg">
            Something broke while rendering this route. Retry the stack or head back home.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="btn btn-outline whitespace-nowrap"
            >
              $ retry
            </button>
            <Link to="/" className="btn btn-solid whitespace-nowrap">
              $ cd /home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#050806" },
      { property: "og:site_name", content: "ColorStack UofA" },
      { title: "ColorStack UofA" },
      { name: "description", content: "The University of Alberta chapter of ColorStack." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "canonical", href: site.url },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=DM+Mono:wght@400;500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: TERMINAL_BOOT_SCRIPT }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
