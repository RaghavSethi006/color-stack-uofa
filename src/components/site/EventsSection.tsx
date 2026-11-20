import { useEffect, useState } from "react";
import { toast } from "sonner";
import { site, type Layer, type SiteEvent } from "@/config/site";
import {
  buildIcsContent,
  filterEventsByLayer,
  formatCountdown,
  formatEventDateParts,
  LAYER_COLORS,
  splitEvents,
} from "@/lib/events";
import { SectionHead } from "./SiteChrome";
import { Ext, NotifyForm } from "./bits";

const LAYERS: { id: Layer | "all"; label: string }[] = [
  { id: "all", label: "All layers" },
  { id: "community", label: "Community" },
  { id: "academic", label: "Academic" },
  { id: "career", label: "Career" },
  { id: "access", label: "Access" },
];

function downloadIcs(ev: SiteEvent) {
  const content = buildIcsContent(ev);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.id.replace(/[^a-z0-9-_]/gi, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast(`Saved ${ev.title}.ics`);
}

function EventRow({ ev, highlight, countdown }: { ev: SiteEvent; highlight?: boolean; countdown?: string | null }) {
  const parts = formatEventDateParts(ev.start);
  const color = LAYER_COLORS[ev.layer];

  return (
    <article
      className={`event-card brut grid gap-5 p-5 md:grid-cols-[7.5rem_1fr_auto] md:items-center ${highlight ? "is-next" : ""}`}
      style={{ ["--c" as string]: `var(--${color})` }}
    >
      <div className="event-date flex flex-col justify-center border-2 border-ink bg-yellow px-3 py-2 text-center text-slab">
        <span className="mono text-[11px]">{parts.month}</span>
        <span className="font-display text-4xl leading-none font-black tabular-nums">{parts.day}</span>
        <span className="mono mt-1 text-[11px]">
          {parts.weekday} · {parts.time}
        </span>
      </div>

      <div>
        <div className="mb-1.5 flex flex-wrap items-center gap-3">
          <span className="mono inline-flex items-center gap-1.5 font-semibold">
            <span className="h-2.5 w-2.5" style={{ background: `var(--${color})` }} aria-hidden="true" />
            {ev.layer}
          </span>
          <span className="mono text-mute">· {ev.location}</span>
          {highlight && countdown && (
            <span className="mono bg-ink px-2 py-0.5 text-yellow tabular-nums">Next · in {countdown}</span>
          )}
        </div>
        <h3 className="font-display text-2xl leading-tight font-extrabold">{ev.title}</h3>
        {ev.description && <p className="mt-1.5 text-[15px] text-mute">{ev.description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {ev.rsvpUrl ? (
          <Ext href={ev.rsvpUrl} className="btn btn-solid whitespace-nowrap">
            RSVP
          </Ext>
        ) : (
          <Ext href="" why="RSVP link opens closer to the event.">
            RSVP
          </Ext>
        )}
        <button type="button" onClick={() => downloadIcs(ev)} className="btn btn-outline whitespace-nowrap">
          Add to calendar
        </button>
      </div>
    </article>
  );
}

export function EventsSection() {
  const [layer, setLayer] = useState<Layer | "all">("all");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { upcoming, past } = splitEvents(site.events, now);
  const filteredUpcoming = filterEventsByLayer(upcoming, layer);
  const filteredPast = filterEventsByLayer(past, layer);
  const nextEvent = upcoming[0];
  const countdown = nextEvent ? formatCountdown(nextEvent.start, now) : null;

  return (
    <section id="events" className="events-zone zone-dark py-20 md:py-28">
      <div className="wrap reveal relative z-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionHead id="events" title="What's next." />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter events by layer">
            {LAYERS.map((l) => {
              const active = layer === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLayer(l.id)}
                  className={`filter-btn mono ${active ? "is-active" : ""}`}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredUpcoming.length > 0 ? (
          <div className="space-y-5">
            {filteredUpcoming.map((ev) => (
              <EventRow
                key={ev.id}
                ev={ev}
                highlight={nextEvent?.id === ev.id}
                countdown={nextEvent?.id === ev.id ? countdown : null}
              />
            ))}
          </div>
        ) : (
          <div className="brut events-empty grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:items-center md:p-8">
            <div>
              <p className="mono mb-2 text-yellow">Status / Calendar open</p>
              <h3 className="font-display text-3xl leading-tight font-extrabold">
                Nothing on the calendar yet. Be first to know.
              </h3>
              <p className="mt-2 text-mute">
                {layer === "all"
                  ? "Study nights, resume reviews, and socials drop here as soon as rooms are booked."
                  : `No upcoming ${layer} events right now. Switch to all layers or get notified when the next one drops.`}
              </p>
            </div>
            <NotifyForm list="events" label="Notify me when events drop" />
          </div>
        )}

        {filteredPast.length > 0 && (
          <details className="mt-8 border-2 border-dashed p-5">
            <summary className="mono cursor-pointer select-none">
              Past events ({filteredPast.length})
            </summary>
            <div className="mt-5 space-y-4">
              {filteredPast.map((ev) => (
                <EventRow key={ev.id} ev={ev} />
              ))}
            </div>
          </details>
        )}
      </div>
    </section>
  );
}
