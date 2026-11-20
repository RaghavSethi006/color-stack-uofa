import { useEffect, useState } from "react";
import { sections, stackSegments } from "@/config/site";

/** Active section id (scrollspy), per-segment fill 0..1, and scroll flags. */
export function useScrollState() {
  const [state, setState] = useState({
    active: "",
    segmentFill: stackSegments.map(() => 0),
    scrolled: false,
    heroPassed: false,
    nearJoin: false,
  });

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      const probe = vh * 0.35;
      let active = "";

      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) active = s.id;
      }

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const docProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const segCount = stackSegments.length;
      const segmentFill = stackSegments.map((_, idx) => {
        const start = idx / segCount;
        const span = 1 / segCount;
        return Math.min(1, Math.max(0, (docProgress - start) / span));
      });

      const join = document.getElementById("join")?.getBoundingClientRect();
      setState({
        active,
        segmentFill,
        scrolled: window.scrollY > 24,
        heroPassed: window.scrollY > vh * 0.75,
        nearJoin: !!join && join.top < vh * 0.92,
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return state;
}
