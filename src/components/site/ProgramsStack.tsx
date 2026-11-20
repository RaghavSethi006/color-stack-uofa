import { useState } from "react";
import { content as c } from "@/content";
import { site, type Layer } from "@/config/site";
import { filterEventsByLayer, formatEventDateParts, splitEvents } from "@/lib/events";

const colorVar = (k: string) => `var(--${k})`;
const programPatterns = ["triangles", "blocks", "chevrons", "pluses"];

function ProgramPattern({ type }: { type: string }) {
  return (
    <div aria-hidden="true" className={`pattern-canvas shape-pattern shape-${type}`}>
      <div className="shape-track">
        {[0, 1].map((group) => (
          <div className="shape-set" key={group}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgramsStack() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { upcoming } = splitEvents(site.events);

  return (
    <div className="programs-stack">
      {c.programs.items.map((p, i) => {
        const layerKey = p.name.toLowerCase() as Layer;
        const isOpen = expanded === p.name;
        const layerEvents = filterEventsByLayer(upcoming, layerKey);
        const panelId = `program-panel-${layerKey}`;

        return (
          <article
            key={p.name}
            className={`layer-card stack-sheet overflow-hidden ${isOpen ? "is-expanded" : ""}`}
            style={{
              ["--c" as string]: colorVar(p.color),
              ["--i" as string]: i,
            }}
          >
            <ProgramPattern type={programPatterns[i] ?? "triangles"} />
            <div className="flex items-start justify-between gap-3">
              <p className="mono mb-4 flex items-center gap-2">
                <span className="h-3.5 w-3.5 shrink-0" style={{ background: colorVar(p.color) }} />
                Layer {String(i + 1).padStart(2, "0")} / {p.name}
              </p>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setExpanded(isOpen ? null : p.name)}
                className="layer-toggle mono"
              >
                {isOpen ? "[-]" : "[+]"}
                <span className="sr-only">
                  {isOpen ? `Collapse ${p.name} details` : `Expand ${p.name} details`}
                </span>
              </button>
            </div>
            <h3
              className="mb-3 font-display text-[26px] leading-[1.02]"
              style={{ fontVariationSettings: '"wdth" 78, "wght" 800' }}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : p.name)}
                className="text-left hover:underline"
              >
                {p.title}
              </button>
            </h3>
            <p className="text-[15px] text-mute">{p.body}</p>

            <div id={panelId} hidden={!isOpen} className="layer-detail mt-5 border-t-2 border-dashed pt-4">
              <p className="mono mb-2 text-ink">Coming up in {p.name}</p>
              {layerEvents.length > 0 ? (
                <ul className="space-y-2">
                  {layerEvents.slice(0, 2).map((ev) => {
                    const d = formatEventDateParts(ev.start);
                    return (
                      <li key={ev.id} className="border-2 border-ink bg-bg2 p-2.5 text-sm">
                        <span className="mono block text-mute">
                          {d.month} {d.day} · {d.time} · {ev.location}
                        </span>
                        <span className="font-semibold">{ev.title}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="border-2 border-dashed border-ink bg-bg2 p-3">
                  <p className="text-sm text-mute">No upcoming {p.name.toLowerCase()} events scheduled yet.</p>
                  <a href="#events" className="mono mt-2 inline-block underline underline-offset-4 hover:text-cobalt">
                    See calendar →
                  </a>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
