import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATIONS = [
  { name: "EVC PLUS", fact: "Hormuud mobile money · largest Somali wallet rail" },
  { name: "ZAAD", fact: "Telesom mobile money · Somaliland backbone" },
  { name: "SAHAL", fact: "Golis mobile money · Puntland coverage" },
  { name: "E-DAHAB", fact: "Somtel money transfer · diaspora remittance links" },
  { name: "E-BESA", fact: "IBS Bank e-wallet · bank-grade mobile money" },
  { name: "MY-CASH", fact: "Amal Bank e-wallet · retail & SME coverage" },
  { name: "PREMIER WALLET", fact: "Premier Bank e-wallet · merchant acceptance" },
  { name: "RUKPI CORE", fact: "Unified clearing · exactly-once USD settlement", core: true },
  { name: "SIPS BANK HUB", fact: "ISO 20022 messaging · central-bank switch" },
  { name: "CASH AGENTS", fact: "Cash-in / cash-out network · last-mile liquidity" },
];

export default function NetworkRails() {
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        if (!track || !scope.current) return;
        const distance = track.scrollWidth - scope.current.clientWidth;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: 0.5,
          },
        });
        tl.to(track, { x: -distance, ease: "none", duration: STATIONS.length }, 0);
        // stations pop in as they approach the center of the viewport
        gsap.utils.toArray<HTMLElement>(".rail-station").forEach((el, i) => {
          tl.fromTo(
            el,
            { scale: 0.6, opacity: 0.4 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "power4.out" },
            Math.max(0, i - 0.5),
          );
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-ink-0 py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="mx-auto w-full max-w-content px-6">
        <p className="eyebrow text-teal">Network Aggregation</p>
        <h2 className="mt-5 max-w-2xl font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
          Ten heterogeneous rails, one protocol-agnostic contract.
        </h2>
      </div>

      {/* Track */}
      <div className="mt-14 lg:mt-20">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-0 overflow-x-auto px-6 pb-6 lg:snap-none lg:overflow-visible lg:px-24 lg:pb-0"
        >
          {STATIONS.map((s, i) => (
            <div
              key={s.name}
              className="rail-station relative flex w-[280px] shrink-0 snap-center flex-col items-center px-6 text-center lg:w-[340px]"
            >
              {/* connector line */}
              {i < STATIONS.length && (
                <div
                  className={`absolute top-[9px] h-px w-full ${i === STATIONS.length - 1 ? "hidden" : ""} ${
                    s.core ? "bg-teal" : "bg-ink-4"
                  }`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative z-10 block rounded-full ${
                  s.core
                    ? "h-5 w-5 bg-teal shadow-[0_0_24px_rgba(0,163,161,0.8)] ring-4 ring-teal/25"
                    : "h-[18px] w-[18px] border border-teal/60 bg-ink-0"
                }`}
              />
              <p
                className={`mt-6 font-mono text-[13px] tracking-[0.08em] ${
                  s.core ? "font-medium text-teal" : "text-txt"
                }`}
              >
                {s.name}
              </p>
              <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-txt-sub">{s.fact}</p>
            </div>
          ))}
        </div>

        {/* settlement particles along the visible rail */}
        <div className="relative mx-auto mt-4 hidden h-8 max-w-content lg:block" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-teal opacity-70"
              style={{
                animation: `rail-pan ${6 + i * 1.3}s linear infinite`,
                animationDelay: `${i * 0.9}s`,
                left: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
