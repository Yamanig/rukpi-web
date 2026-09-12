import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Faint drifting rail particles in the deep-teal background. */
function DriftParticles() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
      viewBox="0 0 1440 500"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="#00A3A1" strokeWidth="1" fill="none" opacity="0.5">
        <path d="M-40 460 C 400 380, 900 420, 1480 180" />
        <path d="M-40 380 C 360 300, 860 340, 1480 100" />
        <path d="M-40 300 C 320 220, 820 260, 1480 40" />
      </g>
      <g fill="#00A3A1">
        {[
          { d: "M-40 460 C 400 380, 900 420, 1480 180", dur: "16s", begin: "0s" },
          { d: "M-40 380 C 360 300, 860 340, 1480 100", dur: "20s", begin: "-5s" },
          { d: "M-40 300 C 320 220, 820 260, 1480 40", dur: "18s", begin: "-9s" },
          { d: "M-40 460 C 400 380, 900 420, 1480 180", dur: "22s", begin: "-12s" },
          { d: "M-40 380 C 360 300, 860 340, 1480 100", dur: "15s", begin: "-3s" },
          { d: "M-40 300 C 320 220, 820 260, 1480 40", dur: "24s", begin: "-15s" },
        ].map((p, i) => (
          <circle key={i} r="3">
            <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={p.d} />
          </circle>
        ))}
      </g>
    </svg>
  );
}

export default function ClosingCta() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      const split = new SplitText(".closing-headline", { type: "words" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 70%" },
        defaults: { ease: "power4.out" },
      });
      tl.from(split.words, { opacity: 0, y: 20, duration: 0.7, stagger: 0.05 })
        .from(".closing-body", { opacity: 0, y: 16, duration: 0.6 }, 0.3)
        .from(".closing-cta", { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, 0.5)
        .from(".closing-footnote", { opacity: 0, duration: 0.6 }, 0.8);
      return () => split.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-teal-deep py-28 lg:py-40">
      <DriftParticles />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="eyebrow text-teal">Built in Mogadishu. Built for the continent.</p>
        <h2 className="closing-headline mt-6 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
          Your Money, Unified.
        </h2>
        <p className="closing-body mt-6 text-lg leading-relaxed text-txt-sub">
          Join the pilot. Be among the first merchants and wallets on Somalia's unified
          payment layer.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/contact" className="closing-cta btn-primary group">
            Get the App
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
          <Link to="/merchants" className="closing-cta btn-ghost group">
            For Merchants
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>
        <p className="closing-footnote mt-12 font-mono text-[12px] tracking-[0.08em] text-txt-ter">
          PHASE 5 PILOT · 50 MERCHANTS · 500 WALLETS · MOGADISHU
        </p>
      </div>
    </section>
  );
}
