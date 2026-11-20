import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { content as c } from "@/content";
import { site } from "@/config/site";
import { useInView, reducedMotion } from "./hooks";

type Line = { kind: "in" | "out"; text: string };
const INTRO: Line[] = [
  { kind: "in", text: "whoami" },
  { kind: "out", text: "black_and_latinx_students --in computing --at uofa" },
  { kind: "in", text: "ls ./chapter" },
  { kind: "out", text: "community/  academics/  careers/  summit/" },
  { kind: "out", text: "type `help` to look around." },
];

export function toggleTerminalMode() {
  const on = document.documentElement.classList.toggle("terminal-mode");
  try { localStorage.setItem("cs-terminal-mode", on ? "1" : "0"); } catch { /* ignore */ }
  return on;
}

function run(cmd: string): string | "CLEAR" {
  const [name = "", ...rest] = cmd.trim().split(/\s+/);
  switch (name.toLowerCase()) {
    case "": return "";
    case "help": return "commands: help whoami ls cat about programs summit events join theme clear sudo";
    case "whoami": return "black_and_latinx_students --in computing --at uofa";
    case "ls": return "community/  academics/  careers/  summit/";
    case "cat": return rest[0] === "about" ? c.about.paragraphs.join("\n\n") : "usage: cat about";
    case "programs": return c.programs.items.map((p) => `[${p.name.toLowerCase()}] ${p.title}`).join("\n");
    case "summit": return `${c.summit.label}: six members, YEG → SFO, ${c.summit.route.distance.toLowerCase()}.`;
    case "events": {
      const up = site.events.filter((e) => new Date(e.end ?? e.start) > new Date());
      return up.length ? up.map((e) => `${e.start.slice(0, 10)}  ${e.title} @ ${e.location}`).join("\n") : "nothing on the calendar yet. follow @colorstackuofa.";
    }
    case "join": {
      const el = document.getElementById("join");
      el?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
      el?.classList.add("flash"); setTimeout(() => el?.classList.remove("flash"), 1500);
      return "opening ./join …";
    }
    case "theme": return toggleTerminalMode() ? "terminal mode: on" : "terminal mode: off";
    case "clear": return "CLEAR";
    case "sudo": return "nice try. permissions are earned at study night.";
    default: return `command not found: ${name}. try \`help\``;
  }
}

export function Terminal() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const [lines, setLines] = useState<Line[]>([]);
  const [val, setVal] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!seen) return;
    if (reducedMotion()) { setLines(INTRO); return; }
    let i = 0;
    const t = setInterval(() => { i++; setLines(INTRO.slice(0, i)); if (i >= INTRO.length) clearInterval(t); }, 260);
    return () => clearInterval(t);
  }, [seen]);
  useEffect(() => { out.current?.scrollTo({ top: out.current.scrollHeight }); }, [lines]);

  // "/" focuses the terminal from anywhere
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") { e.preventDefault(); input.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const exec = (cmd: string) => {
    const r = run(cmd);
    if (r === "CLEAR") setLines([]);
    else setLines((l) => [...l, { kind: "in", text: cmd }, ...(r ? [{ kind: "out" as const, text: r }] : [])]);
    if (cmd.trim()) setHist((h) => [...h, cmd]);
    setHi(-1); setVal("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") exec(val);
    else if (e.key === "ArrowUp" && hist.length) { e.preventDefault(); const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); setHi(n); setVal(hist[n] ?? ""); }
    else if (e.key === "ArrowDown" && hi >= 0) { e.preventDefault(); const n = hi + 1; if (n >= hist.length) { setHi(-1); setVal(""); } else { setHi(n); setVal(hist[n] ?? ""); } }
  };

  return (
    <div ref={ref} className="term tape relative scanlines">
      <div className="term-bar"><span>uofa@colorstack:~</span><span aria-hidden="true">[_][□][x]</span></div>
      <div ref={out} className="term-out" aria-live="polite" onClick={() => input.current?.focus()}>
        {lines.map((l, i) => <pre key={i} className={l.kind === "in" ? "term-in" : "term-res"}>{l.kind === "in" ? `> ${l.text}` : l.text}</pre>)}
        <div className="term-prompt">
          <label htmlFor="term-input" className="sr-only">Terminal command</label>
          <span aria-hidden="true">&gt;</span>
          <input id="term-input" ref={input} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={onKey}
            autoComplete="off" autoCapitalize="off" spellCheck={false} className="term-input" placeholder="type help · press / to focus" />
        </div>
      </div>
      <div className="term-chips" aria-label="Try a command">
        <span className="mono opacity-70">try:</span>
        {["help", "whoami", "programs", "summit", "join", "sudo"].map((k) => (
          <button key={k} type="button" className="term-chip mono" onClick={() => exec(k)}>{k}</button>
        ))}
      </div>
    </div>
  );
}

const commits = [
  { hash: "a2020cs", year: "2020", msg: "init: ColorStack founded by Jehron Petty at Cornell", color: "orange" },
  { hash: "b2025ab", year: "2025", msg: "feat: first chapter outside the U.S. opens in Alberta", color: "cobalt" },
  { hash: "c2026sf", year: "2026", msg: "ship: six members at Stacked Up Summit, San Francisco", color: "yellow" },
];
export function GitLog() {
  return (
    <ol className="git-log" aria-label="Chapter timeline">
      <li className="mono git-head">$ git log --oneline --graph</li>
      {commits.map((c, i) => (
        <li key={c.hash} className="git-commit reveal" style={{ ["--c" as string]: `var(--${c.color})`, ["--i" as string]: i }}>
          <span className="git-dot" aria-hidden="true" />
          <span className="mono git-hash">{c.hash}</span>
          <span className="mono git-year">{c.year}</span>
          <span className="git-msg">{c.msg}</span>
        </li>
      ))}
    </ol>
  );
}
