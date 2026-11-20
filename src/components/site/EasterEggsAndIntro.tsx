import { useEffect, useState } from "react";
import { toast } from "sonner";
import { reducedMotion } from "./hooks";
import { toggleTerminalMode } from "./Terminal";

/** First-visit intro overlay (1.2s max, once per session, skippable, skipped on ?autostart=1 or reduced-motion). */
export function IntroOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion()) return;
    if (window.location.search.includes("autostart=1") || window.location.hash) return;
    try {
      if (sessionStorage.getItem("cs-intro-seen") === "1") return;
      sessionStorage.setItem("cs-intro-seen", "1");
    } catch {
      /* ignore */
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const dismiss = () => setVisible(false);
    window.addEventListener("keydown", dismiss, { once: true });
    return () => window.removeEventListener("keydown", dismiss);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="intro-overlay"
      onClick={() => setVisible(false)}
      role="dialog"
      aria-label="ColorStack UofA intro"
    >
      <div className="intro-stack" aria-hidden="true">
        <span className="intro-layer l1">COLORSTACK</span>
        <span className="intro-layer l2">COLORSTACK</span>
        <span className="intro-layer l3">COLORSTACK</span>
      </div>
      <p className="mono intro-hint">Click or press any key to skip</p>
    </div>
  );
}

const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const RAIN_ITEMS = Array.from({ length: 24 }, (_, idx) => ({
  id: idx,
  left: (idx * 17 + 5) % 96,
  delay: (idx % 6) * 65,
  color: ["orange", "cobalt", "yellow", "green"][idx % 4]!,
  kind: idx % 2 === 0 ? "sq" : "tri",
}));

/** Konami code listener: rains palette shapes and briefly stacks sections (<= 1.5s). */
export function KonamiRain() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === KONAMI[idx]) {
        idx++;
        if (idx === KONAMI.length) {
          idx = 0;
          toast("Stack overflow! (Konami unlocked)");
          if (!reducedMotion()) {
            setActive(true);
            document.body.classList.add("konami-stack");
            setTimeout(() => {
              setActive(false);
              document.body.classList.remove("konami-stack");
            }, 1500);
          }
        }
      } else {
        idx = k === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;

  return (
    <div className="konami-rain" aria-hidden="true">
      {RAIN_ITEMS.map((item) => (
        <span
          key={item.id}
          className={`rain-shape ${item.kind}`}
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}ms`,
            ["--c" as string]: `var(--${item.color})`,
          }}
        />
      ))}
    </div>
  );
}

export function TerminalModeToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(document.documentElement.classList.contains("terminal-mode"));
    const sync = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setOn(typeof detail === "boolean" ? detail : document.documentElement.classList.contains("terminal-mode"));
    };
    window.addEventListener("cs-terminal-mode-change", sync);
    return () => window.removeEventListener("cs-terminal-mode-change", sync);
  }, []);

  const handleToggle = () => {
    const next = toggleTerminalMode();
    setOn(next);
    toast(next ? "Terminal Mode: ON" : "Terminal Mode: OFF");
  };

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={handleToggle}
      className="cli-btn mono"
    >
      [{on ? "x" : " "}] $ export TERM=crt
    </button>
  );
}

export function BackToTopCli() {
  const goTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  };
  return (
    <button type="button" onClick={goTop} className="cli-btn mono">
      $ cd /top &amp;&amp; scroll --up
    </button>
  );
}
