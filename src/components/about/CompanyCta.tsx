import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Faint rail texture drifting behind the CTA band. */
function RailTexture() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="#00A3A1" strokeWidth="1" fill="none">
        <path d="M-40 380 C 400 300, 900 340, 1480 140" />
        <path d="M-40 300 C 360 220, 860 260, 1480 60" />
        <path d="M-40 340 C 420 260, 920 300, 1480 100" />
      </g>
      <g fill="#00A3A1">
        {[
          { d: "M-40 380 C 400 300, 900 340, 1480 140", dur: "18s", begin: "0s" },
          { d: "M-40 300 C 360 220, 860 260, 1480 60", dur: "22s", begin: "-6s" },
          { d: "M-40 340 C 420 260, 920 300, 1480 100", dur: "20s", begin: "-11s" },
        ].map((p, i) => (
          <circle key={i} r="3">
            <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={p.d} />
          </circle>
        ))}
      </g>
    </svg>
  );
}

export default function CompanyCta() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      const split = new SplitText(".co-cta-headline", { type: "words" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 70%" },
        defaults: { ease: "power4.out" },
      });
      tl.from(split.words, { opacity: 0, y: 20, duration: 0.7, stagger: 0.05 })
        .from(".co-cta-btn", { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, 0.3)
        .from(".co-cta-press", { opacity: 0, duration: 0.6 }, 0.7);
      return () => split.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-teal-deep py-28 lg:py-40">
      {/* faint echo of the skyline's amber horizon glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 115%, rgba(229,169,60,0.18), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <RailTexture />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="co-cta-headline font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
          Stand on the pillar.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/contact" className="co-cta-btn btn-primary group">
            Get the App
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
          <Link to="/merchants" className="co-cta-btn btn-ghost group">
            Join as a merchant
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>
        <p className="co-cta-press mt-12 font-mono text-[12px] tracking-[0.08em] text-txt-ter">
          <Link to="/contact" className="transition-colors hover:text-amber-light">
            PRESS INQUIRIES: PRESS@RUKPI.SO
          </Link>
        </p>
      </div>
    </section>
  );
}
