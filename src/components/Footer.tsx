import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const COLUMNS: { title: string; links: { label: string; to: string; hint?: string; external?: boolean }[] }[] = [
  {
    title: "Products",
    links: [
      { label: "RUKPI PAY", to: "/products/pay" },
      { label: "RUKPI SCORE", to: "/products/score" },
      { label: "For Merchants", to: "/merchants" },
      { label: "RUKPI RESTO", to: "/merchants#resto" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/company" },
      { label: "Careers", to: "/company", hint: "hiring soon" },
      { label: "Contact", to: "/contact" },
      { label: "press@rukpi.finance", to: "mailto:press@rukpi.finance", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/legal" },
      { label: "Terms of Service", to: "/legal#terms" },
    ],
  },
];

function FooterRails() {
  // faint rail lines with drifting particles (design.md 6.2)
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15]"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="#00A3A1" strokeWidth="1" fill="none">
        <path d="M-40 380 C 300 300, 700 340, 1480 120" />
        <path d="M-40 400 C 360 320, 760 360, 1480 180" />
        <path d="M-40 340 C 240 280, 660 320, 1480 60" />
        <path d="M-40 300 C 200 240, 620 280, 1480 10" />
      </g>
      <g fill="#00A3A1">
        <circle cx="0" cy="0" r="3">
          <animateMotion dur="14s" repeatCount="indefinite" path="M-40 380 C 300 300, 700 340, 1480 120" />
        </circle>
        <circle cx="0" cy="0" r="2.5">
          <animateMotion dur="18s" begin="-6s" repeatCount="indefinite" path="M-40 400 C 360 320, 760 360, 1480 180" />
        </circle>
        <circle cx="0" cy="0" r="2.5">
          <animateMotion dur="16s" begin="-3s" repeatCount="indefinite" path="M-40 340 C 240 280, 660 320, 1480 60" />
        </circle>
        <circle cx="0" cy="0" r="2">
          <animateMotion dur="20s" begin="-10s" repeatCount="indefinite" path="M-40 300 C 200 240, 620 280, 1480 10" />
        </circle>
      </g>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-teal-deep">
      <FooterRails />
      <div className="relative mx-auto max-w-content px-6 pb-10 pt-20">
        {/* Top: logo + mission + newsletter */}
        <div className="flex flex-col gap-10 border-b border-white/[0.08] pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center">
              <img
                src="/brand/rukpi-logo-white-transparent.png"
                alt="RUKPI"
                className="h-9 w-auto"
              />
              <span className="ml-2.5 font-display text-xl font-extrabold tracking-[0.08em] text-white">
                RUKPI
              </span>
            </div>
            <p className="mt-5 text-[17px] leading-relaxed text-txt-sub">
              The unified payment layer for Somalia and Pan-Africa.
            </p>
          </div>
          <form
            className="flex w-full max-w-md items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="you@business.so"
              className="h-12 w-full rounded-[4px] border border-ink-4 bg-ink-2/60 px-4 font-mono text-[14px] text-txt placeholder:text-txt-ter focus:border-teal focus:outline-none focus:ring-[3px] focus:ring-teal/20"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-teal-sweep text-white transition-all hover:brightness-[1.08] hover:shadow-teal-glow"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[13px] uppercase tracking-[0.05em] text-txt-ter">
                {col.title}
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.to}
                        className="font-mono text-[14px] text-txt-sub transition-colors hover:text-teal"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        to={l.to}
                        className="text-[14px] text-txt-sub transition-colors hover:text-teal"
                      >
                        {l.label}
                        {l.hint && (
                          <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.05em] text-txt-ter">
                            · {l.hint}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] text-txt-sub">
            © 2025 Rukun Payment Infrastructure · Mogadishu, Somalia
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-white/[0.1] px-2.5 py-1 font-mono text-[11px] tracking-[0.05em] text-txt-sub">
              SOC2-ALIGNED
            </span>
            <span className="rounded-md border border-white/[0.1] px-2.5 py-1 font-mono text-[11px] tracking-[0.05em] text-txt-sub">
              WCAG 2.1 AA
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/[0.1] px-3 py-1 font-mono text-[11px] tracking-[0.05em] text-txt-sub">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
