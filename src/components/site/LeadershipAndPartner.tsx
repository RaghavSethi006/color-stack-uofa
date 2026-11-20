import { useState } from "react";
import { content as c } from "@/content";
import { site } from "@/config/site";
import { Ext, contactHref } from "./bits";
import { SectionHead } from "./SiteChrome";

export function LeadershipAndPartner() {
  const [openRole, setOpenRole] = useState<string | null>(null);
  const roleCopyMap = new Map<string, string>(
    c.leadership.roles.map(([k, v]) => [k ?? "", v ?? ""]),
  );

  return (
    <>
      {/* LEADERSHIP — technical graph paper + expandable portrait role cards */}
      <div className="leadership-zone">
        <div aria-hidden="true" className="stack-schematic pointer-events-none absolute">
          <span />
          <span />
          <span />
        </div>
        <section id="leadership" className="wrap reveal relative z-10 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-[0.95fr_1.25fr] md:gap-16">
            <div>
              <SectionHead id="leadership" title={c.leadership.title} className="mb-5" />
              <p className="mb-8 max-w-[42ch] text-mute">{c.leadership.line}</p>
              <Ext href={contactHref()} className="btn btn-outline">
                {c.leadership.cta}
              </Ext>
            </div>

            <ul className="wire leadership-list bg-background p-4 sm:p-5" aria-label="Chapter leadership roles">
              {site.leads.map((lead) => {
                const desc = roleCopyMap.get(lead.role) ?? "";
                const isOpen = openRole === lead.role;
                const panelId = `lead-panel-${lead.role.toLowerCase()}`;

                return (
                  <li key={lead.role} className="border-b border-dashed py-4 first:pt-1 last:border-b-0 last:pb-1">
                    <div className="flex items-center gap-4">
                      {/* Portrait slot with halftone treatment or unfilled wireframe */}
                      <div className="lead-portrait shrink-0" aria-hidden="true">
                        {lead.photo ? (
                          <img src={lead.photo} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="mono text-[11px]">{lead.role.slice(0, 3)}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="mono font-bold text-ink">{lead.role}</span>
                          {lead.status && (
                            <span
                              className={`mono px-1.5 py-0.5 text-[11px] border border-ink ${
                                lead.status === "open" ? "bg-yellow text-slab" : "bg-ink text-bg"
                              }`}
                            >
                              {lead.status === "open" ? "Open" : "Filled"}
                            </span>
                          )}
                        </div>
                        {lead.name ? (
                          <p className="text-base font-semibold">
                            {lead.name}
                            {lead.pronouns ? <span className="ml-2 text-sm font-normal text-mute">({lead.pronouns})</span> : null}
                          </p>
                        ) : (
                          <p className="text-sm text-mute">Unfilled — ask us about taking this on</p>
                        )}
                      </div>

                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenRole(isOpen ? null : lead.role)}
                        className="layer-toggle mono shrink-0"
                      >
                        {isOpen ? "[-]" : "[+]"}
                        <span className="sr-only">
                          {isOpen ? `Hide ${lead.role} details` : `Show ${lead.role} details`}
                        </span>
                      </button>
                    </div>

                    <div id={panelId} hidden={!isOpen} className="mt-4 border-t border-dashed pt-3 pl-[4.5rem]">
                      <p className="mb-3 text-[15px] text-mute">{desc}</p>
                      <Ext href={contactHref()} className="btn btn-solid !px-4 !py-2 text-sm">
                        Talk to us
                      </Ext>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      {/* PARTNER BAND — compact dark strip for companies, faculty, and sponsors */}
      <aside className="partner-zone zone-dark border-t-3 border-ink py-10 md:py-12" aria-label="Partnerships and sponsorship">
        <div className="wrap flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mono mb-2 text-yellow">For companies, faculty &amp; sponsors</p>
            <p className="font-display text-2xl leading-tight font-extrabold md:text-3xl">
              Hiring or backing Black and Latinx computing students? Talk to us.
            </p>
          </div>
          <Ext href={contactHref()} className="btn btn-outline shrink-0 whitespace-nowrap">
            Talk to us
          </Ext>
        </div>
      </aside>
    </>
  );
}
