import type { Faq } from "../config/site";

export type BaseFaq = { q: string; a: string };
export type ResolvedFaq = { id: string; q: string; a: string };

export function slugifyFaq(question: string): string {
  const slug = question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `faq-${slug || "item"}`;
}

export function buildFaqItems(baseFaqs: readonly BaseFaq[], extraFaqs: readonly Faq[]): ResolvedFaq[] {
  const out: ResolvedFaq[] = [];
  for (const item of baseFaqs) {
    out.push({ id: slugifyFaq(item.q), q: item.q, a: item.a });
  }
  for (const item of extraFaqs) {
    if (item.a !== null && item.a.trim() !== "") {
      out.push({ id: slugifyFaq(item.q), q: item.q, a: item.a });
    }
  }
  return out;
}

export function buildOrganizationJsonLd(siteUrl: string, sameAs: readonly string[] = []) {
  const cleanSameAs = sameAs.filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ColorStack UofA",
    alternateName: "ColorStack University of Alberta Chapter",
    url: siteUrl,
    description:
      "The University of Alberta student chapter of ColorStack, a community for Black and Latinx students in computing in Edmonton, Alberta.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Edmonton",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "ColorStack",
      url: "https://www.colorstack.org",
    },
    ...(cleanSameAs.length ? { sameAs: cleanSameAs } : {}),
  };
}

export function buildFaqJsonLd(faqs: readonly ResolvedFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
