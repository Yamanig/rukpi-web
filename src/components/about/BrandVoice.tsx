import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WE_ARE = [
  "Confident but never arrogant",
  "Technical but always accessible",
  "Precise but never cold",
  "Pan-African by design",
];

const WE_ARE_NOT = [
  "Casual or playful",
  "Overly corporate or sterile",
  "Cluttered or confusing",
  "Generic or bank-like",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        className="voice-mark"
        d="M4 12.5l5 5L20 6.5"
        stroke="#00A3A1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        className="voice-mark"
        d="M6 6l12 12M18 6L6 18"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BrandVoice() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".voice-head", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      });

      // columns slide in from opposite sides (x ±40px, 0.8s)
      gsap.from(".voice-col-are", {
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: { trigger: ".voice-cols", start: "top 75%" },
      });
      gsap.from(".voice-col-not", {
        opacity: 0,
        x: 40,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: { trigger: ".voice-cols", start: "top 75%" },
      });

      // list items stagger, icons draw on
      gsap.from(".voice-item", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: ".voice-cols", start: "top 70%" },
      });
      gsap.fromTo(
        ".voice-mark",
        { strokeDasharray: 32, strokeDashoffset: 32 },
        {
          strokeDashoffset: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".voice-cols", start: "top 70%" },
        },
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-offwhite py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <p className="voice-head eyebrow text-teal">Brand Voice</p>
        <h2 className="voice-head mt-4 max-w-2xl font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ltxt lg:text-5xl">
          How we sound when we speak.
        </h2>

        <div className="voice-cols mt-14 grid gap-6 lg:grid-cols-2">
          {/* WE ARE */}
          <div className="voice-col-are rounded-xl border border-teal/40 bg-white p-8 shadow-light-card lg:p-10">
            <p className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
              We are
            </p>
            <ul className="mt-6 space-y-5">
              {WE_ARE.map((v) => (
                <li key={v} className="voice-item flex items-center gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal/10">
                    <CheckIcon />
                  </span>
                  <span className="font-display text-lg font-semibold text-ltxt">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WE ARE NOT */}
          <div className="voice-col-not rounded-xl border border-bordergray bg-subtle p-8 lg:p-10">
            <p className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-ltxt-muted">
              We are not
            </p>
            <ul className="mt-6 space-y-5">
              {WE_ARE_NOT.map((v) => (
                <li key={v} className="voice-item flex items-center gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
                    <CrossIcon />
                  </span>
                  <span className="font-display text-lg font-semibold text-ltxt-muted">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
