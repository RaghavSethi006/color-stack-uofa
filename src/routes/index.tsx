import { createFileRoute } from "@tanstack/react-router";
import { content as c } from "@/content";
import {
  COLORSTACK_URL,
  EMAIL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  site,
} from "@/config/site";
import { buildOrganizationJsonLd } from "@/lib/faq";
import { SiteChrome, SkipLink, SectionHead, BrandLogo } from "@/components/site/SiteChrome";
import { BrutToaster } from "@/components/site/BrutToaster";
import { EdmontonTime, StatStrip, useWordmarkMotion } from "@/components/site/HeroBits";
import { Terminal, GitLog } from "@/components/site/Terminal";
import { ProgramsStack } from "@/components/site/ProgramsStack";
import { EventsSection } from "@/components/site/EventsSection";
import { SummitSection } from "@/components/site/SummitSection";
import { LeadershipAndPartner } from "@/components/site/LeadershipAndPartner";
import { JoinSection } from "@/components/site/JoinSection";
import {
  BackToTopCli,
  IntroOverlay,
  KonamiRain,
  TerminalModeToggle,
} from "@/components/site/EasterEggsAndIntro";
import { Burst, Ext, Reg } from "@/components/site/bits";
import { usePauseOffscreen } from "@/components/site/hooks";

const title = "ColorStack UofA | Black and Latinx students in computing";
const description =
  "The University of Alberta chapter of ColorStack. A community for Black and Latinx students in computing, run by students in Edmonton.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: "ColorStack UofA" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: site.url },
      { property: "og:image", content: `${site.url}${site.ogImage}` },
      { property: "og:image:alt", content: site.ogImageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ColorStack UofA" },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `${site.url}${site.ogImage}` },
      { name: "twitter:image:alt", content: site.ogImageAlt },
    ],
    links: [{ rel: "canonical", href: site.url }],
  }),
  component: Index,
});

const colorVar = (k: string) => `var(--${k})`;

const ASCII = String.raw`
  ___  ___  _     ___  ___  ___ _____ _   ___ _  __
  / __|/ _ \| |   / _ \| _ \/ __|_   _/_\ / __| |/ /
| (__| (_) | |__| (_) |   /\__ \ | |/ _ \ (__| ' <
 \___|\___/|____|\___/|_|_\|___/ |_/_/ \_\___|_|\_\   // UOFA`;

const ticker = [
  "Black & Latinx in computing",
  "University of Alberta",
  "Edmonton",
  "Community",
  "Careers",
  "Summit",
  "Build together",
];

function Index() {
  usePauseOffscreen("main > *, footer");
  const wordmarkRef = useWordmarkMotion();
  const mail = EMAIL ? `mailto:${EMAIL}` : "";
  const orgLd = buildOrganizationJsonLd(site.url, [INSTAGRAM_URL, LINKEDIN_URL, COLORSTACK_URL]);

  return (
    <div id="top">
      <IntroOverlay />
      <KonamiRain />
      <SkipLink />
      <SiteChrome />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* HERO — comic halftone + pointer parallax + exploded scroll + live time + stat strip */}
        <section className="hero-zone relative">
          <div className="wrap relative z-10 pb-16 pt-8 md:pb-24 md:pt-14">
            <p className="hero-kicker mono mb-6 text-mute">{c.hero.kicker}</p>
            <h1 className="mb-12 md:mb-16">
              <span className="sr-only">{c.hero.srTitle}</span>
              <span ref={wordmarkRef} className="wordmark" aria-hidden="true">
                {["l1", "l2", "l3"].map((l) => (
                  <span key={l} className={l}>
                    COLOR
                    <br className="br" />
                    STACK
                  </span>
                ))}
              </span>
            </h1>

            <div className="grid gap-12 min-[860px]:grid-cols-[1.25fr_1fr] min-[860px]:gap-16">
              <div className="hero-copy self-start">
                <p className="max-w-[30ch] text-[22px] font-medium leading-[1.35] md:text-[28px]">
                  {c.hero.lead}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="#join" className="btn btn-solid whitespace-nowrap">
                    {c.hero.primary}
                  </a>
                  <a href="#programs" className="btn btn-outline whitespace-nowrap">
                    {c.hero.secondary}
                  </a>
                </div>
              </div>

              <div className="chapter-wrap relative self-start">
                <Burst className="-right-1 -top-12 md:-right-6 md:-top-14" tone="green">
                  Est.
                  <br />
                  UofA!
                </Burst>
                <div className="brut chapter-card">
                  <div className="flex items-center justify-between border-b-3 border-ink bg-yellow px-4 py-3 text-slab">
                    <span className="mono">{c.hero.cardLabel}</span>
                    <span className="flex gap-1" aria-hidden="true">
                      {["orange", "cobalt", "yellow", "green"].map((k) => (
                        <span key={k} className="h-2.5 w-2.5" style={{ background: colorVar(k) }} />
                      ))}
                    </span>
                  </div>
                  <dl>
                    {c.hero.rows.map(([k, v], i) => (
                      <div key={k} className={`grid grid-cols-[7.5rem_1fr] gap-3 px-4 py-3 ${i ? "border-t" : ""}`}>
                        <dt className="mono pt-[3px] text-mute">{k}</dt>
                        <dd className="text-[15px] leading-snug">{v}</dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-[7.5rem_1fr] gap-3 border-t px-4 py-3">
                      <dt className="mono pt-[3px] text-mute">Local time</dt>
                      <dd className="text-[15px] leading-snug">
                        <EdmontonTime />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <StatStrip />
          </div>
          <Reg className="left-4 top-4" />
          <Reg className="bottom-4 right-4" />
        </section>

        <div className="marquee" aria-hidden="true" tabIndex={-1}>
          <div>
            {[0, 1].map((k) =>
              ticker.map((t) => (
                <span key={k + t} className="mono flex items-center gap-4 px-4 py-3 text-[14px] font-medium text-ink">
                  {t}
                  <span className="h-2.5 w-2.5 bg-ink" />
                </span>
              )),
            )}
          </div>
        </div>

        {/* 01 / ABOUT — real interactive terminal + git log milestones */}
        <div className="about-zone zone-dark">
          <div aria-hidden="true" className="dither" />
          <section id="about" className="wrap reveal relative z-10 grid gap-10 py-20 md:grid-cols-2 md:gap-16 md:py-28">
            <div>
              <SectionHead id="about" title={c.about.title} />
            </div>
            <div className="about-copy prose-cs space-y-5 text-mute md:mt-9">
              {c.about.paragraphs.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <Terminal />
            <GitLog />
          </section>
        </div>
        <div className="zigzag-divider" aria-hidden="true" />

        {/* 02 / PROGRAMS — physical stack of four layers */}
        <section id="programs" className="programs-zone reveal">
          <div className="wrap relative z-10 pb-24 pt-20 md:pb-32 md:pt-28">
            <div className="relative mb-12">
              <SectionHead id="programs" title={c.programs.title} />
              <Burst className="-top-10 right-0 hidden sm:block">
                4<br />
                layers
              </Burst>
            </div>
            <ProgramsStack />
          </div>
        </section>

        {/* 03 / EVENTS — data-driven calendar with filters, ICS, and empty state */}
        <EventsSection />

        {/* 04 / SUMMIT — count-up, drawn route, boarding pass, photo strip, supporter stickers */}
        <SummitSection />

        {/* 05 / LEADERSHIP & PARTNER BAND */}
        <LeadershipAndPartner />

        {/* 06 / JOIN & FAQ */}
        <JoinSection />
      </main>

      <div className="stack-bar" aria-hidden="true" />
      <div className="zone-dark overflow-x-clip">
        <footer className="wrap grid gap-6 py-12">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <pre aria-hidden="true" className="ascii ascii-cycle">
              {ASCII}
            </pre>
            <div className="flex flex-wrap items-center gap-3">
              <TerminalModeToggle />
              <BackToTopCli />
            </div>
          </div>

          <BrandLogo />

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Ext href={INSTAGRAM_URL} className="hover:text-yellow hover:underline">
              Instagram
            </Ext>
            <Ext
              href={mail}
              className="hover:text-yellow hover:underline"
              why="Chapter email is not published yet — message us on Instagram."
            >
              Email
            </Ext>
            <Ext
              href={LINKEDIN_URL}
              className="hover:text-yellow hover:underline"
              why="Chapter LinkedIn page is coming soon."
            >
              LinkedIn
            </Ext>
            <Ext href={COLORSTACK_URL} className="hover:text-yellow hover:underline">
              ColorStack National
            </Ext>
          </nav>

          <p className="text-mute">{c.footer.line}</p>
          <p className="mono text-mute">{c.footer.copyright}</p>
        </footer>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <BrutToaster />
    </div>
  );
}
