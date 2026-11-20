import { useEffect, useRef, useState } from "react";
import * as Acc from "@radix-ui/react-accordion";
import { toast } from "sonner";
import { content as c } from "@/content";
import { COLORSTACK_URL, INSTAGRAM_URL, SIGNUP_URL, SLACK_URL, site } from "@/config/site";
import { buildFaqItems, buildFaqJsonLd } from "@/lib/faq";
import { Burst, Ext, NotifyForm, Reg } from "./bits";
import { SectionHead } from "./SiteChrome";
import { reducedMotion, useLocalState } from "./hooks";

const colorVar = (k: string) => `var(--${k})`;

const READY_CHECKS = [
  { id: "degree", label: "Pursuing a computing-related degree" },
  { id: "linkedin", label: "Up-to-date LinkedIn profile" },
  { id: "apply", label: "Ready to submit the application at colorstack.org" },
] as const;

const BURST_SHAPES = Array.from({ length: 18 }, (_, idx) => ({
  id: idx,
  color: ["orange", "cobalt", "yellow", "green"][idx % 4]!,
  kind: idx % 2 === 0 ? "sq" : "tri",
  x: ((idx * 37) % 100) - 50,
  y: -30 - ((idx * 23) % 70),
  rot: (idx * 55) % 360,
}));

export function JoinSection() {
  const [checkedSteps, setCheckedSteps] = useLocalState<boolean[]>("cs-join-steps", [false, false, false]);
  const [celebrating, setCelebrating] = useState(false);
  const prevDone = useRef(false);

  const [readyChecks, setReadyChecks] = useState<boolean[]>([false, false, false]);
  const readyCount = readyChecks.filter(Boolean).length;

  const faqs = buildFaqItems(c.join.faqs, site.extraFaqs);
  const [openFaq, setOpenFaq] = useState<string>("");

  const completedCount = checkedSteps.filter(Boolean).length;
  const allDone = completedCount === 3;

  useEffect(() => {
    if (allDone && !prevDone.current) {
      toast("You're in the stack!");
      if (!reducedMotion()) {
        setCelebrating(true);
        const timer = setTimeout(() => setCelebrating(false), 1500);
        prevDone.current = true;
        return () => clearTimeout(timer);
      }
    }
    prevDone.current = allDone;
    return undefined;
  }, [allDone]);

  // Deep-link support for #faq-<slug>
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash.startsWith("faq-")) return;
      const match = faqs.find((f) => f.id === hash);
      if (match) {
        setOpenFaq(match.id);
        document.getElementById(match.id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [faqs]);

  const toggleStep = (index: number) => {
    const next = [0, 1, 2].map((i) => (i === index ? !checkedSteps[i] : !!checkedSteps[i]));
    setCheckedSteps(next);
  };

  const toggleReady = (index: number) => {
    setReadyChecks((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const faqLd = buildFaqJsonLd(faqs);

  return (
    <>
      <div className="zigzag-divider zigzag-dark" aria-hidden="true" />
      <div className="join-zone zone-dark">
        <section id="join" className="wrap reveal relative z-10 py-24 md:py-32">
          <Reg className="right-4 top-6" />

          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <SectionHead id="join" title={c.join.title} />

              {/* 3-color onboarding stack progress bar */}
              <div className="mt-8 border-2 border-ink bg-background p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="mono">Onboarding stack</span>
                  <span className="mono tabular-nums">{completedCount} / 3 complete</span>
                </div>
                <div className="onboarding-bar" aria-hidden="true">
                  <span className={checkedSteps[0] ? "is-filled" : ""} style={{ ["--c" as string]: "var(--orange)" }} />
                  <span className={checkedSteps[1] ? "is-filled" : ""} style={{ ["--c" as string]: "var(--cobalt)" }} />
                  <span className={checkedSteps[2] ? "is-filled" : ""} style={{ ["--c" as string]: "var(--yellow)" }} />
                </div>
                {allDone && (
                  <p className="stamp mono mt-4" role="status">
                    ✓ You're in the stack
                  </p>
                )}
              </div>

              {/* "Am I ready to apply?" mini-check */}
              <div className="wire mt-8 bg-background p-5">
                <p className="mono mb-1 text-yellow">Quick check · client-side only</p>
                <h3 className="mb-3 font-display text-xl font-extrabold">Am I ready to apply?</h3>
                <ul className="space-y-2.5">
                  {READY_CHECKS.map((item, idx) => {
                    const checked = !!readyChecks[idx];
                    return (
                      <li key={item.id}>
                        <label className="flex cursor-pointer items-start gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleReady(idx)}
                            className="brut-check mt-0.5 shrink-0"
                          />
                          <span>{item.label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 border-t border-dashed pt-3">
                  {readyCount === 3 ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="stamp mono" role="status">
                        ✓ Ready to apply
                      </span>
                      <Ext href={COLORSTACK_URL} className="btn btn-solid !px-4 !py-2 text-sm">
                        Go to colorstack.org →
                      </Ext>
                    </div>
                  ) : (
                    <p className="mono text-xs text-mute" role="status">
                      {readyCount} of 3 checked — finish the remaining items above
                    </p>
                  )}
                </div>
              </div>

              <div className="relative mt-10 hidden h-36 md:block">
                <Burst className="left-0 top-0" tone="green">
                  Join
                  <br />
                  now!
                </Burst>
              </div>
            </div>

            <div className="relative">
              {celebrating && (
                <div className="stack-burst" aria-hidden="true">
                  {BURST_SHAPES.map((s) => (
                    <span
                      key={s.id}
                      className={`burst-piece ${s.kind}`}
                      style={{
                        ["--c" as string]: `var(--${s.color})`,
                        ["--tx" as string]: `${s.x}vw`,
                        ["--ty" as string]: `${s.y}vh`,
                        ["--rot" as string]: `${s.rot}deg`,
                      }}
                    />
                  ))}
                </div>
              )}

              <ol className="brut join-steps px-5">
                {c.join.steps.map((s, i) => {
                  const done = !!checkedSteps[i];
                  return (
                    <li
                      key={s.title}
                      className={`grid grid-cols-[3.5rem_1fr] gap-4 border-b border-dashed py-6 last:border-b-0 ${
                        done ? "is-step-done" : ""
                      }`}
                    >
                      <div className="flex flex-col items-start gap-2">
                        <span
                          className="font-mono text-[40px] leading-none"
                          style={{ color: colorVar(["orange", "yellow", "green"][i] ?? "ink") }}
                        >
                          {i + 1}
                        </span>
                        <label className="mono flex cursor-pointer items-center gap-1.5 text-[11px]">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => toggleStep(i)}
                            aria-label={`Mark step ${i + 1} (${s.title}) complete`}
                            className="brut-check"
                          />
                          <span>{done ? "Done" : "Mark"}</span>
                        </label>
                      </div>

                      <div>
                        <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                        {s.body && <p className="mb-4 text-mute">{s.body}</p>}
                        {i === 0 && (
                          <Ext href={COLORSTACK_URL} className="btn btn-solid mt-1">
                            {s.cta}
                          </Ext>
                        )}
                        {i === 1 && (
                          <div className="mt-2">
                            {SIGNUP_URL ? (
                              <Ext href={SIGNUP_URL} className="btn btn-solid">
                                {s.cta}
                              </Ext>
                            ) : (
                              <NotifyForm list="chapter-signup" label="Notify me when chapter sign-up opens" />
                            )}
                          </div>
                        )}
                        {i === 2 && (
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                              {SLACK_URL ? (
                                <Ext href={SLACK_URL} className="font-semibold underline underline-offset-4 hover:text-cobalt">
                                  Slack
                                </Ext>
                              ) : null}
                              <Ext href={INSTAGRAM_URL} className="font-semibold underline underline-offset-4 hover:text-cobalt">
                                Instagram
                              </Ext>
                            </div>
                            {!SLACK_URL && <NotifyForm list="slack" label="Notify me when Slack opens" />}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <Acc.Root
            type="single"
            collapsible
            value={openFaq}
            onValueChange={(v) => setOpenFaq(v)}
            className="wire mt-16 bg-background px-5 md:ml-[calc(50%+2rem)]"
          >
            {faqs.map((f) => (
              <Acc.Item key={f.id} id={f.id} value={f.id} className="border-b border-dashed last:border-b-0">
                <Acc.Header className="flex items-center justify-between gap-2">
                  <Acc.Trigger className="flex flex-1 items-center justify-between gap-4 py-5 text-left text-lg font-semibold hover:text-yellow">
                    <span>{f.q}</span>
                    <span className="faq-plus font-mono text-2xl leading-none" aria-hidden="true">
                      +
                    </span>
                  </Acc.Trigger>
                  <a
                    href={`#${f.id}`}
                    className="mono px-2 py-2 text-xs text-mute hover:text-yellow"
                    aria-label={`Deep link to ${f.q}`}
                  >
                    #
                  </a>
                </Acc.Header>
                <Acc.Content className="faq-content overflow-hidden">
                  <p className="prose-cs pb-5 text-mute">{f.a}</p>
                </Acc.Content>
              </Acc.Item>
            ))}
          </Acc.Root>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
        </section>
      </div>
    </>
  );
}
