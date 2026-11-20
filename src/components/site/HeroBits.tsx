import { useEffect, useRef, useState } from "react";
import { useCountUp, useInView, reducedMotion } from "./hooks";

export function EdmontonTime() {
  const [t, setT] = useState("—");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Edmonton",
      hour: "numeric",
      minute: "2-digit",
      weekday: "short",
    });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <time suppressHydrationWarning className="tabular-nums">
      {t} MT
    </time>
  );
}

const stats = [
  { n: 2020, label: "ColorStack founded", fmt: (v: number) => String(v), color: "orange" },
  { n: 16100, label: "members (FY2025)", fmt: (v: number) => `${v.toLocaleString("en-US")}+`, color: "cobalt" },
  { n: 1606, label: "schools in the network", fmt: (v: number) => v.toLocaleString("en-US"), color: "yellow" },
  { n: 6, label: "of us at Summit 2026", fmt: (v: number) => String(v), color: "green" },
];

function Stat({ s, run, i }: { s: (typeof stats)[number]; run: boolean; i: number }) {
  const v = useCountUp(s.n, run, 10, 700 + i * 120);
  const display = run ? s.fmt(v) : s.fmt(s.n);
  return (
    <div className="stat reveal stagger" style={{ ["--c" as string]: `var(--${s.color})`, ["--i" as string]: i }}>
      <dt className="mono">{s.label}</dt>
      <dd className="stat-num tabular-nums" aria-label={s.fmt(s.n)}>
        <span aria-hidden="true">{display}</span>
      </dd>
    </div>
  );
}

export function StatStrip() {
  const [ref, seen] = useInView<HTMLDListElement>(0.25);
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reducedMotion()), []);
  return (
    <dl ref={ref} className="stat-strip mt-12">
      {stats.map((s, i) => (
        <Stat key={s.label} s={s} i={i} run={armed && seen} />
      ))}
    </dl>
  );
}

/** Pointer parallax on desktop + scroll "exploded view" via CSS vars on the wordmark. */
export function useWordmarkMotion() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    let raf = 0;
    const set = (x: number, y: number) => {
      el.style.setProperty("--px", x.toFixed(4));
      el.style.setProperty("--py", y.toFixed(4));
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5),
      );
    };
    const onScroll = () => {
      const ex = Math.min(1, Math.max(0, window.scrollY / 420));
      el.style.setProperty("--ex", ex.toFixed(4));
    };
    onScroll();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}
