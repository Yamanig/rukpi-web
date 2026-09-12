import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PHASES = [
  {
    phase: "PHASE 1",
    title: "Core Engine",
    body: "Ledger, wallet mutations, double-entry guarantees.",
    current: false,
  },
  {
    phase: "PHASE 2",
    title: "API & Security",
    body: "Type-safe API, auth, encryption, audit journal.",
    current: false,
  },
  {
    phase: "PHASE 3",
    title: "Alpha & Tooling",
    body: "Internal tooling, developer experience, chaos harness.",
    current: false,
  },
  {
    phase: "PHASE 4",
    title: "Frontend Ecosystem Beta",
    body: "PAY, MERCHANT, RESTO, ADMIN — four surfaces, one ledger.",
    current: false,
  },
  {
    phase: "PHASE 5",
    title: "Pilot & Launch",
    body: "30-day closed-loop pilot: 50 merchants, 500 wallets, 1,000 tx/day, SOMAS-denominated.",
    current: true,
  },
];

const GATES = [
  "≥99% TX SUCCESS",
  "≤30S MEDIAN CHECKOUT",
  "ZERO UNRESOLVED LEDGER MISMATCHES",
  "≥95% T+1 SETTLEMENT",
  "SUPPORT ≤4H MEDIAN",
  "NPS ≥40",
];

export default function Roadmap() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(".phase-node", { opacity: 1 });
        gsap.set(".phase-card", { opacity: 1, scale: 1 });
        gsap.set(".roadmap-fill-h", { scaleX: 1 });
        gsap.set(".roadmap-fill-v", { scaleY: 1 });
        return;
      }

      const mm = gsap.matchMedia();

      // Desktop: pinned 200vh horizontal timeline, scroll drives progress (scrub 0.4)
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".roadmap-pin",
            start: "top top",
            end: "+=200%",
            scrub: 0.4,
            pin: true,
            anticipatePin: 1,
          },
        });
        tl.fromTo(".roadmap-fill-h", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" });
        PHASES.forEach((_, i) => {
          const at = (i / PHASES.length) * 0.92 + 0.04;
          // node ignites as the fill reaches it: teal ring + card pop (spring)
          tl.fromTo(
            `.phase-dot-${i}`,
            { scale: 0.5, opacity: 0.3 },
            { scale: 1, opacity: 1, duration: 0.08, ease: "back.out(3)" },
            at,
          ).fromTo(
            `.phase-card-${i}`,
            { opacity: 0.25, y: 12, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: "back.out(1.8)" },
            at,
          );
        });
      });

      // Mobile: vertical timeline, same ignite logic per node
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          ".roadmap-fill-v",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".roadmap-track",
              start: "top 70%",
              end: "bottom 55%",
              scrub: 0.4,
            },
          },
        );
        PHASES.forEach((_, i) => {
          gsap.fromTo(
            `.phase-dot-${i}`,
            { scale: 0.5, opacity: 0.3 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.35,
              ease: "back.out(3)",
              scrollTrigger: { trigger: `.phase-card-${i}`, start: "top 75%" },
            },
          );
          gsap.fromTo(
            `.phase-card-${i}`,
            { opacity: 0.25, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power4.out",
              scrollTrigger: { trigger: `.phase-card-${i}`, start: "top 75%" },
            },
          );
        });
      });

      // gate chips cascade in after unpin (0.06s stagger)
      gsap.from(".gate-chip", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.06,
        ease: "power4.out",
        scrollTrigger: { trigger: ".gate-strip", start: "top 85%" },
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-ink-0">
      <div className="roadmap-pin relative flex min-h-[100dvh] flex-col justify-center overflow-hidden py-24">
        <div className="mx-auto w-full max-w-content px-6">
          <p className="eyebrow text-teal">Roadmap</p>
          <h2 className="mt-4 max-w-2xl font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            Five phases. One destination.
          </h2>

          <div className="roadmap-track relative mt-20 lg:mt-24">
            {/* horizontal track (desktop) */}
            <div className="absolute left-0 right-0 top-[7px] hidden h-0.5 bg-ink-4 lg:block" />
            <div
              className="roadmap-fill-h absolute left-0 right-0 top-[7px] hidden h-0.5 origin-left bg-teal lg:block"
              style={{ boxShadow: "0 0 10px rgba(0,163,161,0.5)" }}
            />
            {/* vertical track (mobile) */}
            <div className="absolute bottom-0 left-[7px] top-0 w-0.5 bg-ink-4 lg:hidden" />
            <div className="roadmap-fill-v absolute bottom-0 left-[7px] top-0 w-0.5 origin-top bg-teal lg:hidden" />

            <div className="grid gap-12 lg:grid-cols-5 lg:gap-6">
              {PHASES.map((p, i) => (
                <div key={p.phase} className="phase-node relative pl-10 lg:pl-0">
                  {/* node dot */}
                  <span
                    className={`phase-dot-${i} absolute left-0 top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-ink-0 lg:relative ${
                      p.current ? "border-amber" : "border-teal"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${p.current ? "bg-amber" : "bg-teal"}`}
                    />
                    {p.current && (
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-50"
                        style={{ animationDuration: "2s" }}
                      />
                    )}
                  </span>

                  <div className={`phase-card-${i} lg:mt-8`}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] font-medium uppercase tracking-[0.05em] text-teal">
                        {p.phase}
                      </span>
                      {p.current && (
                        <span className="rounded-md border border-amber/50 bg-amber/10 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-amber">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-[1.25] text-txt">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-[1.6] text-txt-sub">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Go/No-Go gate strip */}
      <div className="gate-strip border-t border-white/[0.06] bg-ink-alt py-12">
        <div className="mx-auto max-w-content px-6">
          <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-txt-ter">
            Go / No-Go gates for public launch
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {GATES.map((g) => (
              <span
                key={g}
                className="gate-chip rounded-md border border-ink-4 px-3 py-1.5 font-mono text-[12px] tracking-[0.05em] text-txt-sub"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
