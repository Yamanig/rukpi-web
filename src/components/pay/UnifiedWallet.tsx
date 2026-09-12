import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SOURCES = [
  { name: "EVC PLUS", balance: "$468.20", pct: "36.5%", top: "6%" },
  { name: "ZAAD", balance: "$296.75", pct: "23.1%", top: "19%" },
  { name: "SAHAL", balance: "$171.30", pct: "13.3%", top: "32%" },
  { name: "E-DAHAB", balance: "$128.45", pct: "10.0%", top: "45%" },
  { name: "E-BESA", balance: "$96.40", pct: "7.5%", top: "58%" },
  { name: "MY-CASH", balance: "$71.90", pct: "5.6%", top: "71%" },
  { name: "PREMIER WALLET", balance: "$51.50", pct: "4.0%", top: "84%" },
];

/** Bezier stream paths in a 600x520 viewBox, source card right edge -> central balance. */
const PATHS = [
  "M 204 31 C 300 31, 320 260, 392 260",
  "M 204 99 C 300 99, 320 260, 392 260",
  "M 204 166 C 300 166, 320 260, 392 260",
  "M 204 234 C 300 234, 320 260, 392 260",
  "M 204 302 C 300 302, 320 260, 392 260",
  "M 204 369 C 300 369, 320 260, 392 260",
  "M 204 437 C 300 437, 320 260, 392 260",
];

// 8 looping particles distributed across the seven streams
const PARTICLES = [
  { path: 0, dur: "3s", begin: "0s" },
  { path: 0, dur: "3s", begin: "-1.5s" },
  { path: 1, dur: "3.4s", begin: "-0.8s" },
  { path: 2, dur: "2.8s", begin: "-1.2s" },
  { path: 3, dur: "3.6s", begin: "-2s" },
  { path: 4, dur: "3.2s", begin: "-0.4s" },
  { path: 5, dur: "3.1s", begin: "-1.9s" },
  { path: 6, dur: "3.5s", begin: "-0.6s" },
];

export default function UnifiedWallet() {
  const scope = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.from(".uw-copy > *", {
        opacity: reduced ? 0 : 0,
        y: reduced ? 0 : 24,
        duration: reduced ? 0 : 0.7,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      });

      if (!reduced) {
        gsap.from(".uw-source", {
          opacity: 0,
          x: -20,
          duration: 0.6,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: ".uw-demo", start: "top 80%" },
        });
        gsap.from(".uw-central", {
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: { trigger: ".uw-demo", start: "top 80%" },
        });
      }

      // central figure counts up to $1,284.50
      const el = scope.current?.querySelector(".uw-balance");
      if (el) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: 1284.5,
          duration: reduced ? 0 : 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ".uw-demo", start: "top 80%" },
          onUpdate: () => {
            el.textContent = `$${obj.v.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        });
      }
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-ink-0 py-24 lg:py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        {/* Copy */}
        <div className="uw-copy">
          <p className="eyebrow text-teal">Cross-Rail Pooling</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            One balance. Seven sources. Zero fragmentation.
          </h2>
          <p className="mt-6 max-w-[520px] text-lg leading-[1.6] text-txt-sub">
            Funds from any rail become fully fungible USD. Top up from EVC Plus in the morning,
            receive ZAAD at noon — it all lands in one spendable balance.
          </p>
          <div className="mt-8 rounded-xl border border-ink-4/60 bg-ink-1 p-5 font-mono text-[13px] leading-[1.9] tracking-[0.04em] text-txt-sub shadow-teal-edge">
            <p>
              <span className="text-teal">AVAILABLE</span> = TOTAL − RESERVED − ENCUMBERED
            </p>
            <p>
              <span className="text-teal">PRECISION</span>: 4-DECIMAL INTERNAL · USD DISPLAY
            </p>
          </div>
        </div>

        {/* Pooling demo */}
        <div className="uw-demo relative mx-auto aspect-[600/520] w-full max-w-[600px]">
          {/* Streams */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 600 520"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="#00A3A1"
                strokeWidth={hovered === i ? 2 : 1}
                strokeOpacity={hovered === null ? 0.35 : hovered === i ? 1 : 0.15}
                style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <g fill="#00A3A1">
              {PARTICLES.map((p, i) => (
                <circle key={i} r={hovered === p.path ? 4 : 3} opacity={0.9}>
                  <animateMotion
                    dur={p.dur}
                    begin={p.begin}
                    repeatCount="indefinite"
                    path={PATHS[p.path]}
                  />
                </circle>
              ))}
            </g>
          </svg>

          {/* Source cards */}
          {SOURCES.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className={`uw-source absolute left-0 w-[34%] -translate-y-1/2 cursor-pointer rounded-lg border bg-ink-1 px-3 py-2.5 text-left transition-colors duration-300 ${
                hovered === i ? "border-teal" : "border-ink-4/60"
              }`}
              style={{ top: s.top }}
            >
              <p className="font-mono text-[11px] tracking-[0.08em] text-txt-ter">{s.name}</p>
              <p className="tabular mt-0.5 font-mono text-sm text-txt">{s.balance}</p>
            </button>
          ))}

          {/* Central balance card */}
          <div
            className="uw-central absolute right-0 top-1/2 w-[35%] -translate-y-1/2 rounded-xl border border-teal/50 bg-ink-1 p-5 text-center shadow-teal-glow"
          >
            <p className="font-mono text-[11px] tracking-[0.1em] text-txt-ter">
              UNIFIED BALANCE
            </p>
            <p className="uw-balance tabular mt-2 font-mono text-xl font-medium text-txt sm:text-2xl">
              $0.00
            </p>
            <p className="mt-1 font-mono text-[11px] tracking-[0.1em] text-teal">USD</p>
            {/* contribution breakdown tooltip */}
            <div
              className={`pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-teal/40 bg-ink-0 px-2.5 py-1 font-mono text-[11px] tracking-[0.05em] text-teal transition-opacity duration-200 ${
                hovered !== null ? "opacity-100" : "opacity-0"
              }`}
            >
              {hovered !== null
                ? `${SOURCES[hovered].name} → ${SOURCES[hovered].balance} · ${SOURCES[hovered].pct}`
                : "·"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
