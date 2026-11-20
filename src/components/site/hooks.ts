import { useEffect, useRef, useState } from "react";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once the element has entered the viewport. */
export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** Stepped count-up (mechanical, ~10 steps). */
export function useCountUp(target: number, run: boolean, steps = 10, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reducedMotion()) { setV(target); return; }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setV(i >= steps ? target : Math.round((target * i) / steps));
      if (i >= steps) clearInterval(t);
    }, ms / steps);
    return () => clearInterval(t);
  }, [run, target, steps, ms]);
  return run ? v : 0;
}

/** Pause CSS animations in any top-level page band that is offscreen. */
export function usePauseOffscreen(selector = "main > *, footer") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.classList.toggle("is-off", !e.isIntersecting);
    }, { rootMargin: "100px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
}

export function useLocalState<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setV(JSON.parse(raw) as T); } catch { /* ignore */ }
  }, [key]);
  const set = (next: T) => { setV(next); try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ } };
  return [v, set] as const;
}
