import test from "node:test";
import assert from "node:assert/strict";
import type { SiteEvent } from "../config/site";
import { buildIcsContent, filterEventsByLayer, formatCountdown, formatEventDateParts, splitEvents } from "./events";
import { buildFaqItems, buildFaqJsonLd, buildOrganizationJsonLd, slugifyFaq } from "./faq";
import { formatSummitKm, quadraticBezierPoint, SUMMIT_ROUTE_POINTS } from "./summit";
import { evaluateCommand } from "./terminal";

const sampleEvents: SiteEvent[] = [
  {
    id: "past-1",
    title: "Fall Kickoff",
    start: "2026-09-15T18:00:00-06:00",
    location: "CSC 3-33",
    layer: "community",
  },
  {
    id: "future-2",
    title: "Mock Interviews",
    start: "2026-12-10T17:30:00-07:00",
    end: "2026-12-10T19:00:00-07:00",
    location: "ETLC E2-001",
    layer: "career",
    description: "Bring your resume; pair up with upper-years.",
  },
  {
    id: "future-1",
    title: "Build Night",
    start: "2026-12-03T18:00:00-07:00",
    location: "CSC B-02",
    layer: "academic",
  },
];

test("splitEvents partitions and orders upcoming vs past events", () => {
  const now = new Date("2026-11-20T00:00:00Z");
  const { upcoming, past } = splitEvents(sampleEvents, now);
  assert.deepEqual(
    upcoming.map((e) => e.id),
    ["future-1", "future-2"],
  );
  assert.deepEqual(
    past.map((e) => e.id),
    ["past-1"],
  );
});

test("filterEventsByLayer filters correctly", () => {
  assert.equal(filterEventsByLayer(sampleEvents, "all").length, 3);
  assert.deepEqual(
    filterEventsByLayer(sampleEvents, "career").map((e) => e.id),
    ["future-2"],
  );
});

test("formatEventDateParts formats in America/Edmonton", () => {
  const parts = formatEventDateParts("2026-12-03T18:00:00-07:00");
  assert.equal(parts.month, "DEC");
  assert.equal(parts.day, "03");
});

test("formatCountdown returns readable remaining duration or null when past", () => {
  const now = new Date("2026-12-01T18:00:00-07:00");
  assert.equal(formatCountdown("2026-12-03T18:00:00-07:00", now), "2d 0h 0m");
  assert.equal(formatCountdown("2026-11-01T18:00:00-07:00", now), null);
});

test("buildIcsContent emits valid VCALENDAR payload", () => {
  const ics = buildIcsContent(sampleEvents[1]!, new Date("2026-11-20T00:00:00Z"));
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /SUMMARY:Mock Interviews/);
  assert.match(ics, /LOCATION:ETLC E2-001/);
  assert.match(ics, /DESCRIPTION:Bring your resume\\; pair up with upper-years\./);
  assert.match(ics, /END:VCALENDAR/);
});

test("quadraticBezierPoint & formatSummitKm track YEG -> SFO route", () => {
  const { p0, p1, p2 } = SUMMIT_ROUTE_POINTS;
  assert.deepEqual(quadraticBezierPoint(p0, p1, p2, 0), { x: 40, y: 140 });
  assert.deepEqual(quadraticBezierPoint(p0, p1, p2, 0.5), { x: 500, y: 50 });
  assert.deepEqual(quadraticBezierPoint(p0, p1, p2, 1), { x: 960, y: 140 });
  assert.equal(formatSummitKm(0), "0 km");
  assert.equal(formatSummitKm(1), "1,900 km");
});

test("FAQ helpers skip null extraFaqs and build valid JSON-LD", () => {
  assert.equal(slugifyFaq("Is it free?"), "faq-is-it-free");
  const merged = buildFaqItems(
    [{ q: "Who is this for?", a: "Black and Latinx students in computing." }],
    [
      { q: "Is it free?", a: null },
      { q: "Can first-years join?", a: "Yes." },
    ],
  );
  assert.equal(merged.length, 2);
  assert.equal(merged[1]?.id, "faq-can-first-years-join");
  const faqLd = buildFaqJsonLd(merged);
  assert.equal(faqLd["@type"], "FAQPage");
  assert.equal(faqLd.mainEntity.length, 2);
  const orgLd = buildOrganizationJsonLd("https://colorstackuofa.ca", ["https://www.instagram.com/colorstackuofa/"]);
  assert.equal(orgLd["@type"], "Organization");
  assert.equal(orgLd.parentOrganization.name, "ColorStack");
});

test("evaluateCommand handles interactive terminal commands", () => {
  assert.match(evaluateCommand("help", []).output, /whoami/);
  assert.equal(evaluateCommand("whoami", []).output, "black_and_latinx_students --in computing --at uofa");
  assert.equal(evaluateCommand("sudo rm -rf /", []).output, "nice try. permissions are earned at study night.");
  assert.equal(evaluateCommand("join", []).action, "join");
  assert.equal(evaluateCommand("theme", []).action, "theme");
  assert.equal(evaluateCommand("clear", []).action, "clear");
  assert.match(evaluateCommand("events", []).output, /nothing on the calendar yet/);
  assert.match(evaluateCommand("events", sampleEvents, new Date("2026-11-20T00:00:00Z")).output, /Build Night/);
});
