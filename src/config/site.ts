/**
 * Everything the chapter needs to fill in lives here.
 * Empty strings / empty arrays / null render as designed placeholder states, never broken links.
 */
export type Layer = "community" | "academic" | "career" | "access";

export type SiteEvent = {
  id: string;
  title: string;
  /** ISO date-time with offset, e.g. "2026-12-03T18:00:00-07:00" */
  start: string;
  end?: string;
  location: string;
  layer: Layer;
  rsvpUrl?: string;
  description?: string;
};

export type Lead = {
  role: "President" | "Events" | "Partnerships" | "Communications" | "Finance";
  name?: string;
  pronouns?: string;
  photo?: string;
  /** Only shown when set */
  status?: "open" | "filled";
};

export type SummitPhoto = { src: string; alt: string; caption?: string };
export type Faq = { q: string; a: string | null };

export const site = {
  url: "https://colorstackuofa.ca", // TODO: replace with the real domain once published
  ogImage: "/og-image.jpg",
  ogImageAlt: "ColorStack UofA neo-brutalist zine poster reading COLORSTACK UOFA with an Edmonton, AB terminal badge",
  links: {
    instagram: "https://www.instagram.com/colorstackuofa/",
    colorstack: "https://www.colorstack.org",
    linkedin: "",
    slack: "",
    signup: "",
    donate: "", // "Help send the next cohort"
  },
  contact: {
    email: "",
    partnerships: "", // falls back to email, then Instagram
  },
  forms: {
    /** POST { email, list } as JSON. Empty = notify form falls back to Instagram. */
    notifyEndpoint: "",
  },
  events: [
    // Example (keep commented until real):
    // { id: "build-night-1", title: "Build Night", start: "2026-12-03T18:00:00-07:00", location: "CSC B-02", layer: "community", rsvpUrl: "" },
  ] as SiteEvent[],
  leads: [
    { role: "President" },
    { role: "Events" },
    { role: "Partnerships" },
    { role: "Communications" },
    { role: "Finance" },
  ] as Lead[],
  summitPhotos: [] as SummitPhoto[],
  extraFaqs: [
    { q: "Is it free?", a: null },
    { q: "Can first-years join?", a: null },
    { q: "Do I need national membership to attend events?", a: null },
    { q: "How can a company partner with us?", a: null },
    { q: "How can I support the summit fund?", a: null },
  ] as Faq[],
};

/** Back-compat named exports used across the page. */
export const INSTAGRAM_URL = site.links.instagram;
export const COLORSTACK_URL = site.links.colorstack;
export const LINKEDIN_URL = site.links.linkedin;
export const SLACK_URL = site.links.slack;
export const SIGNUP_URL = site.links.signup;
export const EMAIL = site.contact.email;

/** Ordered page sections: drives nav, scrollspy, progress bar and index labels. */
export const sections = [
  { id: "about", label: "About", color: "orange" },
  { id: "programs", label: "Programs", color: "cobalt" },
  { id: "events", label: "Events", color: "yellow" },
  { id: "summit", label: "Summit", color: "green" },
  { id: "leadership", label: "Leadership", color: "orange" },
  { id: "join", label: "Join", color: "cobalt" },
] as const;

/** Four-segment top stack progress bar mapping. */
export const stackSegments = [
  { id: "about", label: "About", color: "orange" },
  { id: "programs", label: "Programs", color: "cobalt" },
  { id: "summit", label: "Summit", color: "yellow" },
  { id: "join", label: "Join", color: "green" },
] as const;
