import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { site } from "@/config/site";
import { evaluateCommand } from "@/lib/terminal";
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
  try {
    localStorage.setItem("cs-terminal-mode", on ? "1" : "0");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("cs-terminal-mode-change", { detail: on }));
  return on;
}

export function Terminal() {
  const [ref, seen] = useInView<HTMLDivElement>(0.25);
  const [lines, setLines] = useState<Line[]>([]);
  const [val, setVal] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLDivElement>(null);
  const typedOnce = useRef(false);

  useEffect(() => {
    if (!seen || typedOnce.current) return;
    typedOnce.current = true;
    if (reducedMotion()) {
      setLines(INTRO);
      return;
    }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setLines(INTRO.slice(0, i));
      if (i >= INTRO.length) clearInterval(t);
    }, 220);
    return () => clearInterval(t);
  }, [seen]);

  useEffect(() => {
    if (out.current) {
      out.current.scrollTop = out.current.scrollHeight;
    }
  }, [lines]);

  // "/" focuses the terminal from anywhere (unless typing inside an input/textarea/select)
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT" && !target?.isContentEditable) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const exec = (cmd: string) => {
    const res = evaluateCommand(cmd, site.events);
    if (res.action === "clear") {
      setLines([]);
    } else if (res.action === "theme") {
      const on = toggleTerminalMode();
      setLines((l) => [
        ...l,
        { kind: "in", text: cmd },
        { kind: "out", text: on ? "terminal mode: on" : "terminal mode: off" },
      ]);
    } else if (res.action === "join") {
      const el = document.getElementById("join");
      el?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
      el?.classList.add("flash");
      setTimeout(() => el?.classList.remove("flash"), 1500);
      setLines((l) => [...l, { kind: "in", text: cmd }, { kind: "out", text: res.output }]);
    } else {
      setLines((l) => [
        ...l,
        { kind: "in", text: cmd },
        ...(res.output ? [{ kind: "out" as const, text: res.output }] : []),
      ]);
    }
    if (cmd.trim()) setHist((h) => [...h, cmd]);
    setHi(-1);
    setVal("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      exec(val);
    } else if (e.key === "ArrowUp" && hist.length) {
      e.preventDefault();
      const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
      setHi(n);
      setVal(hist[n] ?? "");
    } else if (e.key === "ArrowDown" && hi >= 0) {
      e.preventDefault();
      const n = hi + 1;
      if (n >= hist.length) {
        setHi(-1);
        setVal("");
      } else {
        setHi(n);
        setVal(hist[n] ?? "");
      }
    }
  };

  return (
    <div ref={ref} className="term tape relative scanlines md:col-span-2">
      <div className="term-bar">
        <span>uofa@colorstack:~</span>
        <span aria-hidden="true">[_][□][x]</span>
      </div>
      <div ref={out} className="term-out" aria-live="polite" onClick={() => input.current?.focus()}>
        {lines.map((l, i) => (
          <pre key={i} className={l.kind === "in" ? "term-in" : "term-res"}>
            {l.kind === "in" ? `> ${l.text}` : l.text}
          </pre>
        ))}
        <div className="term-prompt">
          <label htmlFor="term-input" className="sr-only">
            Terminal command
          </label>
          <span aria-hidden="true">&gt;</span>
          <input
            id="term-input"
            ref={input}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="term-input"
            placeholder="type help · press / to focus"
          />
        </div>
      </div>
      <div className="term-chips" role="group" aria-label="Try a command">
        <span className="mono opacity-75">try:</span>
        {["help", "whoami", "programs", "summit", "events", "join", "theme", "sudo"].map((k) => (
          <button key={k} type="button" className="term-chip mono" onClick={() => exec(k)}>
            {k}
          </button>
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
    <ol className="git-log md:col-span-2" aria-label="Chapter timeline">
      <li className="mono git-head">$ git log --oneline --graph</li>
      {commits.map((cm, i) => (
        <li
          key={cm.hash}
          className="git-commit reveal stagger"
          style={{ ["--c" as string]: `var(--${cm.color})`, ["--i" as string]: i }}
        >
          <span className="git-dot" aria-hidden="true" />
          <span className="mono git-hash">{cm.hash}</span>
          <span className="mono git-year">{cm.year}</span>
          <span className="git-msg">{cm.msg}</span>
        </li>
      ))}
    </ol>
  );
}
