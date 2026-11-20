import { useState, type ReactNode, type FormEvent } from "react";
import { site } from "@/config/site";

/** External link, or a designed disabled state with an accessible explanation. */
export function Ext({ href, children, className = "", why = "This link isn't live yet." }: { href: string; children: ReactNode; className?: string; why?: string }) {
  if (!href) {
    return (
      <span className="pending-chip mono" role="note">
        <span aria-hidden="true">◌</span> {children}<span className="pending-tag">soon</span>
        <span className="sr-only">: {why}</span>
      </span>
    );
  }
  const isMail = href.startsWith("mailto:");
  return <a href={href} className={className} {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}>{children}</a>;
}

export const contactHref = () =>
  site.contact.partnerships ? `mailto:${site.contact.partnerships}` : site.contact.email ? `mailto:${site.contact.email}` : site.links.instagram;

export function Burst({ children, className = "", tone = "" }: { children: ReactNode; className?: string; tone?: string }) {
  return <div aria-hidden="true" className={`burst-wrap ${className}`}><div className={`burst ${tone}`}>{children}</div></div>;
}
export function Reg({ className }: { className: string }) {
  return <span aria-hidden="true" className={`reg-mark ${className}`}><i /></span>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "Notify me" form. Without a configured endpoint it becomes an Instagram CTA, never a dead field. */
export function NotifyForm({ list, label = "Notify me when it opens" }: { list: string; label?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error" | "invalid">("idle");
  const endpoint = site.forms.notifyEndpoint;
  if (!endpoint) {
    return (
      <div className="notify-fallback">
        <p className="mono text-[13px] opacity-80">&gt; {label.toLowerCase()}: follow us for the drop</p>
        <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-2">Follow @colorstackuofa</a>
      </div>
    );
  }
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) { setState("invalid"); return; }
    setState("loading");
    try {
      const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), list }) });
      setState(r.ok ? "ok" : "error");
    } catch { setState("error"); }
  };
  if (state === "ok") return <p className="stamp mono" role="status">✓ You're on the list</p>;
  const id = `notify-${list}`;
  return (
    <form onSubmit={submit} noValidate className="notify-form">
      <label htmlFor={id} className="mono mb-2 block text-[13px]">{label}</label>
      <div className="flex flex-wrap gap-3">
        <input id={id} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); if (state !== "loading") setState("idle"); }}
          aria-invalid={state === "invalid"} aria-describedby={`${id}-msg`} placeholder="you@ualberta.ca" className="brut-input" />
        <button className="btn btn-solid" disabled={state === "loading"}>{state === "loading" ? "Sending…" : "Notify me"}</button>
      </div>
      <p id={`${id}-msg`} role="status" className="mono mt-2 min-h-5 text-[13px]">
        {state === "invalid" && "That email doesn't look right."}
        {state === "error" && "Couldn't send. Try again, or DM us on Instagram."}
      </p>
    </form>
  );
}
