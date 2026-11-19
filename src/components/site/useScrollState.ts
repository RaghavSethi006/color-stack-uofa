import { useEffect, useState } from "react";
import { sections } from "@/config/site";

/** Active section id (scrollspy), per-section fill 0..1, and whether the page is scrolled. */
export function useScrollState() {
  const [state, setState] = useState({ active: "", fill: sections.map(() => 0), scrolled: false, heroPassed: false, nearJoin: false });
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      const probe = vh * 0.35;
      let active = "";
      const fill = sections.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) active = s.id;
        return Math.min(1, Math.max(0, (probe - r.top) / Math.max(1, r.height)));
      });
      const join = document.getElementById("join")?.getBoundingClientRect();
      setState({
        active,
        fill,
        scrolled: window.scrollY > 24,
        heroPassed: window.scrollY > vh * 0.8,
        nearJoin: !!join && join.top < vh,
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return state;
}
