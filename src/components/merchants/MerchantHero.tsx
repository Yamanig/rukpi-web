import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowDown } from "lucide-react";

gsap.registerPlugin(SplitText, useGSAP);

const TRUST_CHIPS = ["T+1 SETTLEMENT", "11-STEP ONBOARDING", "SHADOW MODE BEFORE GO-LIVE"];

/** Live-feel revenue line drawn on top of the static dashboard image. */
function ChartLineOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 800 500"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="merchant-chart-line"
        d="M40 400 C 120 380, 160 300, 230 310 S 340 240, 400 250 S 520 160, 580 175 S 700 90, 760 100"
        fill="none"
        stroke="#00A3A1"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(0,163,161,0.8))" }}
      />
    </svg>
  );
}

export default function MerchantHero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Looping chart line draw (stroke-dashoffset, 2s loop)
      const line = scope.current?.querySelector<SVGPathElement>(".merchant-chart-line");
      if (line) {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        if (!reduced) {
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
            repeat: -1,
            repeatDelay: 1.2,
          });
        } else {
          gsap.set(line, { strokeDashoffset: 0 });
        }
      }

      if (reduced) {
        gsap.set("[data-hero-reveal]", { opacity: 1, y: 0, x: 0 });
        return;
      }

      const split = new SplitText(".merchant-hero-title", { type: "chars", mask: "chars" });
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".merchant-hero-eyebrow", { opacity: 0, y: 12, duration: 0.5 })
        .from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.02 }, 0.1)
        .from(".merchant-hero-body", { opacity: 0, y: 24, duration: 0.7 }, 0.5)
        .from(".merchant-hero-cta", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, 0.7)
        .from(".merchant-hero-chip", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, 0.85)
        .from(".merchant-hero-frame", { opacity: 0, x: 80, duration: 1 }, 0.3);

      return () => split.revert();
    },
    { scope },
  );

  const scrollToApi = () => {
    document.getElementById("api")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={scope}
      className="relative -mt-[72px] overflow-hidden bg-dark-surface pt-[72px]"
    >
      {/* faint rail glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 50% at 75% 35%, rgba(0,163,161,0.10) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-content items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pb-32 lg:pt-24">
        {/* Copy */}
        <div>
          <p className="merchant-hero-eyebrow eyebrow text-teal">
            RUKPI Merchant · For Business
          </p>
          <h1 className="merchant-hero-title mt-6 font-display text-[42px] font-extrabold leading-[1.0] tracking-[-0.03em] text-txt sm:text-[56px] lg:text-[64px]">
            Accept every wallet in Somalia. Settle in one.
          </h1>
          <p className="merchant-hero-body mt-8 max-w-[560px] text-lg leading-[1.6] text-txt-sub sm:text-xl">
            One QR code and one API for EVC Plus, ZAAD, Sahal, e-Dahab, E-BESA, MY-CASH,
            Premier Wallet, and bank transfers.
            Real-time analytics, T+1 settlement, and a customer base that already pays by
            phone.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/contact?topic=merchants" className="merchant-hero-cta btn-primary group">
              Start Onboarding
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
            <button type="button" onClick={scrollToApi} className="merchant-hero-cta btn-ghost group">
              Read the API docs
              <ArrowDown
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                strokeWidth={1.5}
              />
            </button>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {TRUST_CHIPS.map((c) => (
              <span
                key={c}
                className="merchant-hero-chip rounded-md border border-ink-4 px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-txt-sub"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard in browser-chrome frame */}
        <div className="merchant-hero-frame" style={{ perspective: "1200px" }}>
          <div
            className="relative overflow-hidden rounded-xl border border-ink-4/70 bg-ink-1"
            style={{
              transform: "rotateY(-6deg) rotateX(2deg)",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,163,161,0.15), 0 0 60px rgba(0,163,161,0.12), inset 0 1px 0 rgba(0,163,161,0.25)",
            }}
          >
            {/* browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-ink-2 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-ink-4" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink-4" />
              <span className="h-2.5 w-2.5 rounded-full bg-teal/60" />
              <span className="ml-3 flex-1 rounded-md bg-ink-0 px-3 py-1 font-mono text-[11px] tracking-[0.05em] text-txt-ter">
                merchant.rukpi.finance/dashboard
              </span>
            </div>
            <div className="relative">
              <img
                src="/merchant-dashboard.png"
                alt="RUKPI Merchant dashboard with revenue analytics and transaction grid"
                className="block w-full"
              />
              <ChartLineOverlay />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
