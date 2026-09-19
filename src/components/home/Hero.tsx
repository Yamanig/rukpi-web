import { Suspense, lazy, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(SplitText, useGSAP);

const HeroRailField = lazy(() => import("./HeroRailField"));

const RAILS = [
  "EVC PLUS",
  "ZAAD",
  "SAHAL",
  "E-DAHAB",
  "E-BESA",
  "MY-CASH",
  "PREMIER WALLET",
  "SIPS",
  "AGENTS",
];
const TICKER = [
  "SUB-100MS QR SETTLEMENT",
  "99.99% UPTIME TARGET",
  "EXACTLY-ONCE EXECUTION",
];

/** CSS fallback: static dots drifting on the hero background (reduced motion / no WebGL). */
function CssFallbackDots() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {[
        { top: "24%", left: "58%", d: "0s" },
        { top: "38%", left: "72%", d: "0.6s" },
        { top: "30%", left: "84%", d: "1.2s" },
        { top: "55%", left: "66%", d: "0.3s" },
        { top: "62%", left: "80%", d: "0.9s" },
        { top: "48%", left: "52%", d: "1.5s" },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal"
          style={{ top: p.top, left: p.left, animationDelay: p.d }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) {
        gsap.set("[data-hero-reveal]", { opacity: 1, y: 0 });
        return;
      }
      const split1 = new SplitText(".hero-line-1", {
        type: "chars",
        mask: "chars",
      });
      const split2 = new SplitText(".hero-line-2", {
        type: "chars",
        mask: "chars",
      });
      const splitSub = new SplitText(".hero-sub", { type: "words" });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.5 })
        .from(
          [split1.chars, split2.chars],
          { yPercent: 110, duration: 0.9, stagger: 0.02 },
          0.1,
        )
        .from(
          splitSub.words,
          { opacity: 0, y: 14, duration: 0.7, stagger: 0.03 },
          0.4,
        )
        .from(
          ".hero-chip",
          { opacity: 0, y: 16, duration: 0.5, stagger: 0.06 },
          0.7,
        )
        .from(
          ".hero-cta",
          { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 },
          1.0,
        )
        .from(".hero-ticker", { opacity: 0, y: 24, duration: 0.7 }, 1.2)
        .from(".hero-scroll-hint", { opacity: 0, duration: 0.6 }, 1.4);

      return () => {
        split1.revert();
        split2.revert();
        splitSub.revert();
      };
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative -mt-[72px] flex min-h-[100dvh] min-h-[720px] flex-col overflow-hidden bg-ink-0"
    >
      {/* Background image + 3D particle rails */}
      <img
        src="/hero-rails.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0" aria-hidden="true">
        <Suspense fallback={<CssFallbackDots />}>
          <HeroRailField />
        </Suspense>
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-0/80 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-content flex-1 items-center px-6 pb-24 pt-[120px]">
        <div className="max-w-[720px]">
          <p className="hero-eyebrow font-mono text-[13px] uppercase tracking-[0.18em] text-teal">
            Rukun Payment Infrastructure
          </p>

          <h1 className="mt-6 font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.03em] text-txt sm:text-[64px] lg:text-[80px]">
            <span className="hero-line-1 block">Your Money,</span>
            <span className="hero-line-2 block bg-teal-sweep bg-clip-text text-transparent">
              Unified.
            </span>
          </h1>
          <p className="hero-sub mt-8 max-w-[620px] text-lg leading-[1.6] text-txt-sub sm:text-xl">
            RUKPI connects Somalia's fragmented mobile-money ecosystem — EVC
            Plus, ZAAD, Sahal, e-Dahab, the bank wallets E-BESA, MY-CASH and
            Premier Wallet, and the SIPS bank hub — into one real-time,
            USD-denominated clearing layer.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {RAILS.map((r) => (
              <span key={r} className="hero-chip rail-chip">
                {r}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/contact" className="hero-cta btn-primary group">
              Get the App
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
            <Link to="/merchants" className="hero-cta btn-ghost group">
              For Merchants
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom ticker strip */}
      <div className="hero-ticker relative border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-6 gap-y-2 px-6 py-5">
          {TICKER.map((t, i) => (
            <span key={t} className="flex items-center gap-6">
              <span className="font-mono text-[13px] tracking-[0.05em] text-txt-ter">
                {t}
              </span>
              {i < TICKER.length - 1 && (
                <span className="h-1 w-1 rounded-full bg-teal" />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll-hint pointer-events-none absolute bottom-24 left-1/2 hidden h-14 w-px -translate-x-1/2 overflow-hidden lg:block"
        aria-hidden="true"
      >
        <span className="block h-full w-full animate-scroll-hint bg-teal" />
      </div>
    </section>
  );
}
