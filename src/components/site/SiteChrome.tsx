import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import logo from "@/assets/colorstack-uofa-logo.png.asset.json";
import { content as c } from "@/content";
import { sections, stackSegments } from "@/config/site";
import { useScrollState } from "./useScrollState";
import { reducedMotion } from "./hooks";

const cv = (k: string) => `var(--${k})`;
const pad = (n: number) => String(n).padStart(2, "0");

const PALETTES = [
  ["#23995d", "#12603c", "#c6d83a", "#7fd6a4"],
  ["#12603c", "#c6d83a", "#7fd6a4", "#23995d"],
  ["#c6d83a", "#7fd6a4", "#23995d", "#12603c"],
  ["#7fd6a4", "#23995d", "#12603c", "#c6d83a"],
];

export function SkipLink() {
  return (
    <a href="#main" className="skip-link mono">
      Skip to content
    </a>
  );
}

export function BrandLogo({ onPaletteRotate }: { onPaletteRotate?: () => void }) {
  const clicks = useRef<number[]>([]);
  const paletteIdx = useRef(0);

  const handleClick = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 2500), now];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      paletteIdx.current = (paletteIdx.current + 1) % PALETTES.length;
      const [o, cb, y, g] = PALETTES[paletteIdx.current]!;
      const root = document.documentElement.style;
      root.setProperty("--orange", o!);
      root.setProperty("--cobalt", cb!);
      root.setProperty("--yellow", y!);
      root.setProperty("--green", g!);
      toast("Palette stack rotated!");
      onPaletteRotate?.();
    }
  };

  return (
    <a href="#top" onClick={handleClick} className="flex min-h-11 min-w-0 items-center gap-3 font-semibold">
      <img src={logo.url} alt="" className="h-8 w-8 shrink-0" width={32} height={32} />
      <span className="truncate whitespace-nowrap">{c.brand}</span>
    </a>
  );
}

export function SiteChrome() {
  const s = useScrollState();
  const [open, setOpen] = useState(false);
  const navItems = sections.filter((x) => x.id !== "join");

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  };

  return (
    <>
      <nav className="stack-progress" aria-label="Page progress">
        {stackSegments.map((seg, idx) => {
          const fillVal = s.segmentFill[idx] ?? 0;
          return (
            <a
              key={seg.id}
              href={`#${seg.id}`}
              onClick={(e) => {
                e.preventDefault();
                jumpTo(seg.id);
              }}
              className="stack-progress-seg"
              aria-label={`Jump to ${seg.label}`}
              style={{ ["--c" as string]: cv(seg.color) }}
            >
              <span style={{ transform: `scaleX(${fillVal})` }} />
            </a>
          );
        })}
      </nav>

      <div className={`site-header zone-dark ${s.scrolled ? "is-compact" : ""}`}>
        <header className="wrap grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <BrandLogo />
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
            {navItems.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                aria-current={s.active === n.id ? "location" : undefined}
                className="nav-link hidden whitespace-nowrap md:inline-flex"
                style={{ ["--c" as string]: cv(n.color) }}
              >
                {n.label}
              </a>
            ))}
            <a href="#join" className="btn btn-outline hidden !px-4 !py-2 whitespace-nowrap sm:inline-flex">
              Join
            </a>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger className="menu-btn mono md:hidden" aria-label="Open menu">
                <span aria-hidden="true">[≡]</span> Menu
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="drawer-overlay" />
                <Dialog.Content className="drawer zone-dark scanlines" aria-describedby={undefined}>
                  <div className="term-bar">
                    <Dialog.Title className="mono">uofa@colorstack:~/menu</Dialog.Title>
                    <Dialog.Close className="drawer-close mono" aria-label="Close menu">
                      [x] Esc
                    </Dialog.Close>
                  </div>
                  <p className="mono px-5 pt-6 opacity-70">&gt; ls ./sections</p>
                  <nav aria-label="Mobile" className="px-5 py-4">
                    <ol>
                      {navItems.map((n, i) => (
                        <li
                          key={n.id}
                          className="drawer-item"
                          style={{ ["--i" as string]: i, ["--c" as string]: cv(n.color) }}
                        >
                          <a
                            href={`#${n.id}`}
                            onClick={() => setOpen(false)}
                            aria-current={s.active === n.id ? "location" : undefined}
                          >
                            <span className="mono drawer-idx">{pad(i + 1)}</span>
                            {n.label}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                  <div className="px-5 pb-8">
                    <a
                      href="#join"
                      onClick={() => setOpen(false)}
                      className="btn btn-solid w-full justify-center"
                    >
                      Join the chapter
                    </a>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </nav>
        </header>
      </div>

      <div
        className={`join-bar md:hidden ${s.heroPassed && !s.nearJoin ? "is-on" : ""}`}
        aria-hidden={!(s.heroPassed && !s.nearJoin)}
      >
        <span className="mono">Black &amp; Latinx in computing</span>
        <a href="#join" className="btn btn-solid !py-2 whitespace-nowrap" tabIndex={s.heroPassed && !s.nearJoin ? 0 : -1}>
          Join
        </a>
      </div>
    </>
  );
}

/** "01 / About" label + h2 with variable-font hover nudge and copy-link button. */
export function SectionHead({ id, title, className = "" }: { id: string; title: string; className?: string }) {
  const i = sections.findIndex((x) => x.id === id);
  const label = i >= 0 ? `${pad(i + 1)} / ${sections[i]?.label}` : id;
  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast(`Copied link to ${sections[i]?.label ?? id}`);
    } catch {
      toast("Couldn't copy. Copy the URL from your address bar.");
    }
  };
  return (
    <>
      <p className="comic-label mono mb-6">{label}</p>
      <div className={`h2-wrap ${className}`}>
        <h2 className="h2 h2-nudge">{title}</h2>
        <button type="button" onClick={copy} className="copy-link mono" aria-label={`Copy link to ${title}`}>
          #
        </button>
      </div>
    </>
  );
}
