import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import * as Acc from "@radix-ui/react-accordion";
import logo from "@/assets/colorstack-uofa-logo.png.asset.json";
import { content as c } from "@/content";
import { COLORSTACK_URL, EMAIL, INSTAGRAM_URL, LINKEDIN_URL, SIGNUP_URL, SLACK_URL } from "@/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ColorStack UofA | Black and Latinx students in computing" },
      { name: "description", content: "The University of Alberta chapter of ColorStack. A community for Black and Latinx students in computing, run by students in Edmonton." },
      { property: "og:title", content: "ColorStack UofA" },
      { property: "og:description", content: "A community for Black and Latinx students in computing at the University of Alberta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const colorVar = (k: string) => `var(--${k})`;

function Ext({ href, children, className = "", button }: { href: string; children: ReactNode; className?: string; button?: boolean }) {
  if (!href) {
    return <span className={`mono text-mute ${button ? "inline-block py-3" : ""}`} aria-disabled="true">{typeof children === "string" ? `${children}: ` : ""}{c.comingSoon}</span>;
  }
  const isMail = href.startsWith("mailto:");
  return (
    <a href={href} className={className} {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
      {children}
    </a>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="comic-label mono mb-6">{children}</p>;
}

function Brand() {
  return (
    <a href="#top" className="flex min-w-0 items-center gap-3 font-semibold">
      <img src={logo.url} alt="" className="h-8 w-8 shrink-0" width={32} height={32} />
      <span className="truncate">{c.brand}</span>
    </a>
  );
}

const ASCII = String.raw`
  ___  ___  _     ___  ___  ___ _____ _   ___ _  __
  / __|/ _ \| |   / _ \| _ \/ __|_   _/_\ / __| |/ /
| (__| (_) | |__| (_) |   /\__ \ | |/ _ \ (__| ' <
 \___|\___/|____|\___/|_|_\|___/ |_/_/ \_\___|_|\_\   // UOFA`;

const ticker = ["Black & Latinx in computing", "University of Alberta", "Edmonton", "Community", "Careers", "Summit", "Build together"];
const programPatterns = ["triangles", "blocks", "chevrons", "pluses"];

function ProgramPattern({ type }: { type: string }) {
  return (
    <div aria-hidden="true" className={`pattern-canvas shape-pattern shape-${type}`}>
      <div className="shape-track">
        {[0, 1].map((group) => (
          <div className="shape-set" key={group}>
            {Array.from({ length: 6 }, (_, i) => <span key={i} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function Index() {
  const mail = EMAIL ? `mailto:${EMAIL}` : "";
  return (
    <div id="top">
      <div className="zone-dark border-b-3 border-ink"><header className="wrap grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5">
        <Brand />
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          {c.nav.map((n) => (
            <a key={n.href} href={n.href} className="hidden px-3 py-2 text-[15px] font-medium hover:underline hover:underline-offset-4 sm:inline-block">{n.label}</a>
          ))}
          <a href="#join" className="btn btn-outline !px-4 !py-2">Join</a>
        </nav>
      </header></div>

      <main>
        {/* HERO — comic halftone + op-art rings */}
        <section className="hero-zone relative">
          <div className="wrap relative z-10 pb-16 pt-8 md:pb-24 md:pt-14">
          <p className="hero-kicker mono mb-6 text-mute">{c.hero.kicker}</p>
          <h1 className="mb-12 md:mb-16">
            <span className="sr-only">{c.hero.srTitle}</span>
            <span className="wordmark" aria-hidden="true">
              {["l1", "l2", "l3"].map((l) => (
                <span key={l} className={l}>COLOR<br className="br" />STACK</span>
              ))}
            </span>
          </h1>
          <div className="grid gap-12 min-[860px]:grid-cols-[1.25fr_1fr] min-[860px]:gap-16">
            <div className="hero-copy self-start">
              <p className="max-w-[30ch] text-[22px] font-medium leading-[1.35] md:text-[28px]">{c.hero.lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#join" className="btn btn-solid">{c.hero.primary}</a>
                <a href="#programs" className="btn btn-outline">{c.hero.secondary}</a>
              </div>
            </div>
            <div className="brut chapter-card self-start">
              <div className="flex items-center justify-between border-b-3 border-ink bg-yellow px-4 py-3">
                <span className="mono">{c.hero.cardLabel}</span>
                <span className="flex gap-1">
                  {["orange", "cobalt", "yellow", "green"].map((k) => <span key={k} className="h-2.5 w-2.5" style={{ background: colorVar(k) }} />)}
                </span>
              </div>
              <dl>
                {c.hero.rows.map(([k, v], i) => (
                  <div key={k} className={`grid grid-cols-[7.5rem_1fr] gap-3 px-4 py-3 ${i ? "border-t" : ""}`}>
                    <dt className="mono pt-[3px] text-mute">{k}</dt>
                    <dd className="text-[15px] leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div>
            {[0, 1].map((k) => ticker.map((t) => (
              <span key={k + t} className="mono flex items-center gap-4 px-4 py-3 text-[14px] font-medium text-ink">{t}<span className="h-2.5 w-2.5 bg-ink" /></span>
            )))}
          </div>
        </div>

        {/* ABOUT — terminal output + drifting ASCII columns */}
        <div className="about-zone zone-dark"><div aria-hidden="true" className="dither" />
          <section id="about" className="wrap reveal relative z-10 grid gap-10 py-20 md:grid-cols-2 md:gap-16 md:py-28">
            <div>
              <Label>{c.about.label}</Label>
              <h2 className="h2">{c.about.title}</h2>
            </div>
            <div className="about-copy prose-cs space-y-5 text-mute md:mt-9">
              {c.about.paragraphs.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
            </div>
            <div className="term relative scanlines md:col-span-2">
              <div className="term-bar"><span>uofa@colorstack:~</span><span>[_][□][x]</span></div>
              <pre>{`> whoami
  black_and_latinx_students --in computing --at uofa
> ls ./chapter
  community/  academics/  careers/  summit/
> ./join --chapter uofa `}<span className="caret" /></pre>
            </div>
          </section>
        </div>
        <div className="zigzag-divider" aria-hidden="true" />

        {/* PROGRAMS — a distinct animated print texture for every layer */}
        <section id="programs" className="programs-zone reveal">
          <div className="wrap relative z-10 pt-20 md:pt-28 pb-24 md:pb-32">
          <Label>{c.programs.label}</Label>
          <h2 className="h2 mb-12">{c.programs.title}</h2>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {c.programs.items.map((p, i) => (
              <article key={p.name} className="layer-card overflow-hidden" style={{ ["--c" as string]: colorVar(p.color) }}>
                <ProgramPattern type={programPatterns[i] ?? "triangles"} />
                <p className="mono mb-6 flex items-center gap-2">
                  <span className="h-3.5 w-3.5 shrink-0" style={{ background: colorVar(p.color) }} />
                  Layer / {p.name}
                </p>
                <h3 className="mb-3 font-display text-[26px] leading-[1.02]" style={{ fontVariationSettings: '"wdth" 78, "wght" 800' }}>{p.title}</h3>
                <p className="text-[15px] text-mute">{p.body}</p>
              </article>
            ))}
          </div>
          </div>
        </section>

        {/* SUMMIT — kinetic chevrons + animated flight path */}
        <section id="summit" className="summit-zone slab zone-dark bg-slab py-20 text-slab-fg md:py-24">
          <div aria-hidden="true" className="kinetic-bars pointer-events-none absolute">
            {Array.from({ length: 12 }, (_, i) => <span key={i} style={{ ["--i" as string]: i }} />)}
          </div>
          <div className="wrap reveal relative z-10">
            <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
              <div className="relative isolate">
                <p className="summit-numeral font-display leading-[0.8] text-yellow" style={{ fontVariationSettings: '"wdth" 62, "wght" 900', fontSize: "clamp(9rem, 26vw, 20rem)" }}>{c.summit.numeral}</p>
                <p className="summit-caption mono mt-4">{c.summit.caption}</p>
              </div>
              <div className="summit-copy md:mt-6">
                <p className="mono mb-4 opacity-80">{c.summit.label}</p>
                <h2 className="h2 mb-6">{c.summit.title}</h2>
                <p className="prose-cs opacity-85">{c.summit.body}</p>
                <p className="mono mt-8 mb-2 opacity-70">{c.summit.supportLabel}</p>
                <p className="prose-cs">{c.summit.supporters.join(", ")}.</p>
              </div>
            </div>
            <svg viewBox="0 0 1000 170" className="mt-14 w-full" role="img" aria-label={`Route from Edmonton (${c.summit.route.from}) to San Francisco (${c.summit.route.to}), ${c.summit.route.distance}`}>
              <path className="route-path" d="M40 140 Q500 -40 960 140" fill="none" />
              <polygon className="route-node" points="40,127 53,140 40,153 27,140" fill="var(--yellow)" />
              <polygon className="route-node route-node-late" points="960,127 973,140 960,153 947,140" fill="var(--yellow)" />
              <g fill="var(--slab-fg)" fontFamily="DM Mono, monospace" fontSize="15" letterSpacing="1.5">
                <text x="40" y="168" textAnchor="middle">{c.summit.route.from}</text>
                <text x="960" y="168" textAnchor="middle">{c.summit.route.to}</text>
                <text x="500" y="38" textAnchor="middle">{c.summit.route.distance.toUpperCase()}</text>
              </g>
            </svg>
          </div>
        </section>

        {/* LEADERSHIP — technical graph paper + floating Y2K wireframe */}
        <div className="leadership-zone">
          <div aria-hidden="true" className="stack-schematic pointer-events-none absolute"><span /><span /><span /></div>
          <section id="leadership" className="wrap reveal relative z-10 grid gap-10 py-20 md:grid-cols-2 md:gap-16 md:py-28">
            <div>
              <Label>{c.leadership.label}</Label>
              <h2 className="h2 mb-5">{c.leadership.title}</h2>
              <p className="mb-8 text-mute">{c.leadership.line}</p>
              <Ext href={mail || INSTAGRAM_URL} className="btn btn-outline" button>{c.leadership.cta}</Ext>
            </div>
            <dl className="wire leadership-list bg-background px-5 py-2">
              {c.leadership.roles.map(([r, d]) => (
                <div key={r} className="grid gap-1 border-b border-dashed py-4 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="mono pt-[3px]">{r}</dt>
                  <dd className="text-mute">{d}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* JOIN — rotating pixel sun + halftone fade */}
        <div className="zigzag-divider zigzag-dark" aria-hidden="true" />
        <div className="join-zone zone-dark">
          <section id="join" className="wrap reveal relative z-10 py-24 md:py-32">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <Label>{c.join.label}</Label>
                <h2 className="h2">{c.join.title}</h2>
              </div>
              <ol className="brut join-steps px-5">
                {c.join.steps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-dashed py-6 last:border-b-0">
                    <span className="font-mono text-[40px] leading-none" style={{ color: colorVar(["orange", "yellow", "green"][i] ?? "ink") }}>{i + 1}</span>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                      {s.body && <p className="mb-4 text-mute">{s.body}</p>}
                      {i === 0 && <Ext href={COLORSTACK_URL} className="btn btn-solid mt-1">{s.cta}</Ext>}
                      {i === 1 && <div className="mt-2"><Ext href={SIGNUP_URL} className="btn btn-solid" button>{s.cta}</Ext></div>}
                      {i === 2 && (
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <Ext href={SLACK_URL} className="font-semibold underline underline-offset-4 hover:text-cobalt">Slack</Ext>
                          <Ext href={INSTAGRAM_URL} className="font-semibold underline underline-offset-4 hover:text-cobalt">Instagram</Ext>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <Acc.Root type="single" collapsible className="wire mt-16 bg-background px-5 md:ml-[calc(50%+2rem)]">
              {c.join.faqs.map((f) => (
                <Acc.Item key={f.q} value={f.q} className="border-b border-dashed last:border-b-0">
                  <Acc.Header>
                    <Acc.Trigger className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold hover:text-cobalt">
                      {f.q}
                      <span className="faq-plus font-mono text-2xl leading-none" aria-hidden="true">+</span>
                    </Acc.Trigger>
                  </Acc.Header>
                  <Acc.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <p className="prose-cs pb-5 text-mute">{f.a}</p>
                  </Acc.Content>
                </Acc.Item>
              ))}
            </Acc.Root>
          </section>
        </div>
      </main>

      <div className="stack-bar" aria-hidden="true" />
      <div className="zone-dark"><footer className="wrap grid gap-6 py-12">
        <pre aria-hidden="true" className="ascii">{ASCII}</pre>
        <Brand />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Ext href={INSTAGRAM_URL} className="hover:text-cobalt hover:underline">Instagram</Ext>
          <Ext href={mail} className="hover:text-cobalt hover:underline">Email</Ext>
          <Ext href={LINKEDIN_URL} className="hover:text-cobalt hover:underline">LinkedIn</Ext>
          <Ext href={COLORSTACK_URL} className="hover:text-cobalt hover:underline">ColorStack National</Ext>
        </nav>
        <p className="text-mute">{c.footer.line}</p>
        <p className="mono text-mute">{c.footer.copyright}</p>
      </footer></div>
    </div>
  );
}
