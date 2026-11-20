import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { content as c } from "@/content";
import { site } from "@/config/site";
import { formatSummitKm, quadraticBezierPoint, SUMMIT_ROUTE_POINTS } from "@/lib/summit";
import { reducedMotion, useCountUp, useInView } from "./hooks";
import { Ext, contactHref } from "./bits";
import { SectionHead } from "./SiteChrome";

const stickerTones = ["orange", "yellow", "green", "cobalt"] as const;
const stickerTilts = [-2.2, 1.8, -1.4, 2.4];
const photoTilts = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.4];

export function SummitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [numRef, seen] = useInView<HTMLDivElement>(0.25);
  const [armed, setArmed] = useState(false);
  const [routeT, setRouteT] = useState(1);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    setArmed(!reducedMotion());
  }, []);

  const countVal = useCountUp(6, armed && seen, 6, 550);
  const displayNum = armed && seen ? countVal : 6;

  // Drive SVG path draw and diamond flight marker from scroll position across #summit
  useEffect(() => {
    if (reducedMotion()) {
      setRouteT(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / Math.max(1, r.height * 0.55)));
      setRouteT(progress);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const photos = site.summitPhotos;
  const activePhoto = lightboxIdx !== null ? photos[lightboxIdx] : undefined;

  useEffect(() => {
    if (lightboxIdx === null || photos.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setLightboxIdx((idx) => (idx === null ? null : (idx + 1) % photos.length));
      } else if (e.key === "ArrowLeft") {
        setLightboxIdx((idx) => (idx === null ? null : (idx - 1 + photos.length) % photos.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, photos.length]);

  const { p0, p1, p2 } = SUMMIT_ROUTE_POINTS;
  const marker = quadraticBezierPoint(p0, p1, p2, routeT);
  const arrived = routeT >= 0.96;

  return (
    <section
      id="summit"
      ref={sectionRef}
      className="summit-zone slab zone-dark bg-slab py-20 text-slab-fg md:py-28"
    >
      <div aria-hidden="true" className="kinetic-bars pointer-events-none absolute">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>

      <div className="wrap reveal relative z-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div ref={numRef} className="relative isolate">
            <p
              className="summit-numeral font-display leading-[0.8] text-yellow tabular-nums"
              style={{ fontVariationSettings: '"wdth" 62, "wght" 900', fontSize: "clamp(9rem, 26vw, 20rem)" }}
              aria-label="6"
            >
              <span aria-hidden="true">{displayNum}</span>
            </p>
            <p className="summit-caption mono mt-4">{c.summit.caption}</p>
          </div>

          <div className="summit-copy">
            <SectionHead id="summit" title={c.summit.title} className="mb-6" />
            <p className="mono mb-3 opacity-80">{c.summit.label}</p>
            <p className="prose-cs opacity-90">{c.summit.body}</p>
          </div>
        </div>

        {/* Animated route diagram + boarding pass */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-stretch">
          <div className="summit-route-box flex flex-col justify-between">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-2">
              <span className="mono text-yellow">Flight telemetry / YEG → SFO</span>
              <span className="mono tabular-nums text-slab-fg" aria-live="off">
                {formatSummitKm(routeT)} / {c.summit.route.distance}
              </span>
            </div>
            <svg
              viewBox="0 0 1000 175"
              className="w-full"
              role="img"
              aria-label={`Route from Edmonton (${c.summit.route.from}) to San Francisco (${c.summit.route.to}), ${c.summit.route.distance}`}
            >
              <path d="M40 140 Q500 -40 960 140" fill="none" stroke="rgba(198,216,58,0.2)" strokeWidth="2" strokeDasharray="6 6" />
              <path
                className="route-draw"
                d="M40 140 Q500 -40 960 140"
                fill="none"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - routeT}
              />
              <polygon points="40,129 51,140 40,151 29,140" fill="var(--yellow)" />
              <polygon
                className={`route-dest ${arrived ? "is-arrived" : ""}`}
                points="960,127 973,140 960,153 947,140"
                fill={arrived ? "var(--green)" : "var(--yellow)"}
              />
              <g transform={`translate(${marker.x}, ${marker.y})`}>
                <polygon points="0,-11 11,0 0,11 -11,0" fill="var(--orange)" stroke="var(--yellow)" strokeWidth="2.5" />
              </g>
              <g fill="var(--slab-fg)" fontFamily="DM Mono, monospace" fontSize="15" letterSpacing="1.5">
                <text x="40" y="168" textAnchor="middle">
                  {c.summit.route.from}
                </text>
                <text x="960" y="168" textAnchor="middle">
                  {c.summit.route.to}
                </text>
                <text x="500" y="34" textAnchor="middle">
                  {c.summit.route.distance.toUpperCase()}
                </text>
              </g>
            </svg>
          </div>

          {/* Brutalist Boarding Pass */}
          <aside className="boarding-pass" aria-label="Summit boarding pass">
            <div className="boarding-head flex items-center justify-between border-b-3 border-ink bg-yellow px-4 py-2.5 text-slab">
              <span className="mono font-bold">BOARDING PASS</span>
              <span className="mono">COLORSTACK // UOFA</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b-2 border-dashed px-4 py-4">
              <div>
                <span className="mono block text-mute">FROM</span>
                <span className="font-display text-3xl font-black">{c.summit.route.from}</span>
                <span className="mono block text-mute">Edmonton</span>
              </div>
              <span className="mono text-yellow" aria-hidden="true">
                ──▶
              </span>
              <div className="text-right">
                <span className="mono block text-mute">TO</span>
                <span className="font-display text-3xl font-black">{c.summit.route.to}</span>
                <span className="mono block text-mute">San Francisco</span>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-2 px-4 py-3 text-sm">
              <div>
                <dt className="mono text-mute">PASSENGERS</dt>
                <dd className="font-semibold">6 members</dd>
              </div>
              <div>
                <dt className="mono text-mute">FLIGHT</dt>
                <dd className="mono">—</dd>
              </div>
              <div>
                <dt className="mono text-mute">GATE / SEAT</dt>
                <dd className="mono">— / —</dd>
              </div>
              <div className="col-span-3 border-t border-dashed pt-2.5">
                <dt className="mono text-mute">EVENT</dt>
                <dd className="font-semibold">{c.summit.label}</dd>
              </div>
            </dl>
            <div className="boarding-barcode" aria-hidden="true" />
          </aside>
        </div>

        {/* Taped Polaroid Photo Strip */}
        <div className="mt-14">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <p className="mono text-yellow">Summit dispatch / Photo strip</p>
            <p className="mono text-mute">
              {photos.length > 0 ? `${photos.length} photos · click any frame to inspect` : "4 slots ready for chapter photos"}
            </p>
          </div>
          <div className="photo-strip grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {photos.length > 0
              ? photos.slice(0, 6).map((photo, idx) => (
                  <button
                    key={photo.src + idx}
                    type="button"
                    onClick={() => setLightboxIdx(idx)}
                    className="polaroid tape text-left"
                    style={{ ["--tilt" as string]: `${photoTilts[idx % photoTilts.length]}deg` }}
                  >
                    <div className="polaroid-frame duotone-frame">
                      <img src={photo.src} alt={photo.alt} loading="lazy" />
                    </div>
                    <p className="mono mt-3 text-xs text-slab">
                      {photo.caption ?? photo.alt}
                    </p>
                  </button>
                ))
              : Array.from({ length: 4 }, (_, idx) => (
                  <div
                    key={idx}
                    className="polaroid polaroid-empty tape"
                    style={{ ["--tilt" as string]: `${photoTilts[idx % photoTilts.length]}deg` }}
                  >
                    <div className="polaroid-frame polaroid-placeholder">
                      <span className="mono text-xs">FRAME 0{idx + 1}</span>
                      <span className="mono text-[11px] opacity-75">YEG → SFO</span>
                    </div>
                    <p className="mono mt-3 text-xs text-slab">
                      Summit frame 0{idx + 1} · add photo in config
                    </p>
                  </div>
                ))}
          </div>
        </div>

        {/* Keyboard-accessible Lightbox */}
        <Dialog.Root open={lightboxIdx !== null} onOpenChange={(o) => !o && setLightboxIdx(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="drawer-overlay" />
            <Dialog.Content className="lightbox brut zone-dark" aria-describedby={undefined}>
              <div className="term-bar">
                <Dialog.Title className="mono">
                  summit-photo [{lightboxIdx !== null ? lightboxIdx + 1 : 0}/{photos.length}]
                </Dialog.Title>
                <Dialog.Close className="mono drawer-close" aria-label="Close photo lightbox">
                  [x] Esc
                </Dialog.Close>
              </div>
              {activePhoto && (
                <div className="p-4 sm:p-6">
                  <div className="duotone-frame border-3 border-yellow bg-slab">
                    <img src={activePhoto.src} alt={activePhoto.alt} className="max-h-[65vh] w-full object-contain" />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-slab-fg">{activePhoto.caption ?? activePhoto.alt}</p>
                    {photos.length > 1 && (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxIdx((idx) => (idx === null ? null : (idx - 1 + photos.length) % photos.length))
                          }
                          className="btn btn-outline !py-2"
                        >
                          ← Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => setLightboxIdx((idx) => (idx === null ? null : (idx + 1) % photos.length))}
                          className="btn btn-outline !py-2"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Supporters sticker wall + Next cohort CTA */}
        <div className="mt-14 border-t-2 border-dashed pt-10">
          <p className="mono mb-5 text-yellow">{c.summit.supportLabel}</p>
          <ul className="sticker-wall flex flex-wrap gap-4" aria-label="Summit supporters">
            {c.summit.supporters.map((sup, i) => {
              const tone = stickerTones[i % stickerTones.length];
              return (
                <li
                  key={sup}
                  className="sticker mono"
                  style={{
                    ["--c" as string]: `var(--${tone})`,
                    color: tone === "cobalt" ? "var(--slab-fg)" : "var(--slab)",
                    ["--tilt" as string]: `${stickerTilts[i % stickerTilts.length]}deg`,
                  }}
                >
                  {sup}
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {site.links.donate ? (
              <Ext href={site.links.donate} className="btn btn-outline">
                Help send the next cohort
              </Ext>
            ) : (
              <>
                <Ext
                  href=""
                  why="Summit sponsorship link is not set yet. Reach out via email or Instagram to back the next cohort."
                >
                  Help send the next cohort
                </Ext>
                <Ext href={contactHref()} className="btn btn-outline">
                  Back the next cohort →
                </Ext>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
