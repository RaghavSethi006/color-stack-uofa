import type { Layer, SiteEvent } from "../config/site";

export const LAYER_COLORS: Record<Layer, string> = {
  community: "orange",
  academic: "cobalt",
  career: "yellow",
  access: "green",
};

export function splitEvents(events: readonly SiteEvent[], now: Date = new Date()) {
  const nowMs = now.getTime();
  const upcoming: SiteEvent[] = [];
  const past: SiteEvent[] = [];

  for (const ev of events) {
    const endMs = new Date(ev.end ?? ev.start).getTime();
    if (Number.isNaN(endMs) || endMs >= nowMs) {
      upcoming.push(ev);
    } else {
      past.push(ev);
    }
  }

  upcoming.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  past.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  return { upcoming, past };
}

export function filterEventsByLayer(events: readonly SiteEvent[], layer: Layer | "all"): SiteEvent[] {
  if (layer === "all") return [...events];
  return events.filter((e) => e.layer === layer);
}

export function formatEventDateParts(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { month: "TBD", day: "—", weekday: "—", time: "TBD" };
  }
  const tz = "America/Edmonton";
  const month = new Intl.DateTimeFormat("en-CA", { timeZone: tz, month: "short" }).format(d).toUpperCase();
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: tz, day: "2-digit" }).format(d);
  const weekday = new Intl.DateTimeFormat("en-CA", { timeZone: tz, weekday: "short" }).format(d).toUpperCase();
  const time = new Intl.DateTimeFormat("en-CA", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(d);
  return { month, day, weekday, time };
}

export function formatCountdown(startIso: string, now: Date = new Date()): string | null {
  const diffMs = new Date(startIso).getTime() - now.getTime();
  if (Number.isNaN(diffMs) || diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)}m`;
}

function toIcsUtc(iso: string, fallbackOffsetMs = 0): string {
  const base = new Date(iso);
  const d = Number.isNaN(base.getTime()) ? new Date() : new Date(base.getTime() + fallbackOffsetMs);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function buildIcsContent(event: SiteEvent, now: Date = new Date()): string {
  const dtStamp = toIcsUtc(now.toISOString());
  const dtStart = toIcsUtc(event.start);
  const dtEnd = event.end ? toIcsUtc(event.end) : toIcsUtc(event.start, 60 * 60 * 1000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ColorStack UofA//Chapter Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(event.id)}@colorstackuofa.ca`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  }
  if (event.rsvpUrl) {
    lines.push(`URL:${event.rsvpUrl}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}
