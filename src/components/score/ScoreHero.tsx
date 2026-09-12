import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);

const CX = 180;
const CY = 190;
const R = 135;
const ARC_LEN = Math.PI * R; // semicircle
const TARGET = 742;

function polar(v: number, r: number) {
  const phi = Math.PI * (1 - v / 1000);
  return { x: CX + r * Math.cos(phi), y: CY - r * Math.sin(phi) };
}

const TICKS = [0, 300, 500, 750, 1000].map((v) => ({
  v,
  inner: polar(v, R - 8),
  outer: polar(v, R + 8),
  label: polar(v, R + 28),
}));

export default function ScoreHero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const arc = scope.current?.querySelector(".score-arc");
      const needle = scope.current?.querySelector(".score-needle");
      const readout = scope.current?.querySelector(".score-readout");

      const render = (v: number) => {
        if (arc) gsap.set(arc, { strokeDashoffset: ARC_LEN * (1 - v / 1000) });
        if (needle) gsap.set(needle, { rotation: -90 + (v / 1000) * 180, svgOrigin: `${CX} ${CY}` });
        if (readout) readout.textContent = String(Math.round(v));
      };

      if (reduced) {
        render(TARGET);
        return;
      }

      gsap.set(".score-chip-wrap", { perspective: 600 });

      const split = new SplitText(".score-headline", { type: "words" });
      const st = { v: 0 };

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      // gauge sweep 0 -> 742 with 4% overshoot + elastic settle
      tl.to(st, {
        v: TARGET * 1.04,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => render(st.v),
      })
        .to(st, {
          v: TARGET,
          duration: 0.6,
          ease: "elastic.out(1, 0.45)",
          onUpdate: () => render(st.v),
        })
        // tier chip flips in after settle
        .from(
          ".score-chip",
          { rotateX: 90, opacity: 0, duration: 0.5, ease: "power4.out" },
          "-=0.15",
        )
        // copy reveal delayed until gauge settles
        .from(".score-eyebrow", { opacity: 0, y: 12, duration: 0.5 }, "-=0.2")
        .from(split.words, { opacity: 0, y: 20, duration: 0.7, stagger: 0.03 }, "-=0.3")
        .from(".score-sub", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4");

      return () => split.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative -mt-[72px] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-ink-0 pb-20 pt-[120px]"
    >
      <style>{`
        @keyframes score-drift {
          from { transform: rotate(0deg) scale(1.25); }
          to { transform: rotate(360deg) scale(1.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          .score-drift { animation: none !important; }
        }
      `}</style>

      {/* background dial backdrop at 30% opacity, slow radial drift */}
      <img
        src="/score-dial-bg.png"
        alt=""
        aria-hidden="true"
        className="score-drift pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 object-contain opacity-30"
        style={{ animation: "score-drift 60s linear infinite" }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-0/40 via-transparent to-ink-0"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center px-6">
        {/* Gauge */}
        <svg
          viewBox="0 0 360 230"
          className="w-[320px]"
          role="img"
          aria-label="RUKPI SCORE gauge showing 742 out of 1000, tier GOOD"
        >
          <defs>
            <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00A3A1" />
              <stop offset="60%" stopColor="#00A3A1" />
              <stop offset="100%" stopColor="#E5A93C" />
            </linearGradient>
          </defs>

          {/* track */}
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke="#2A3A47"
            strokeOpacity="0.5"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* progress arc */}
          <path
            className="score-arc"
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke="url(#score-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={ARC_LEN}
            strokeDashoffset={ARC_LEN}
          />
          {/* tier-boundary ticks + labels */}
          {TICKS.map((t) => (
            <g key={t.v}>
              <line
                x1={t.inner.x}
                y1={t.inner.y}
                x2={t.outer.x}
                y2={t.outer.y}
                stroke="#5A6E78"
                strokeWidth="1.5"
              />
              <text
                x={t.label.x}
                y={t.label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#5A6E78"
                fontSize="11"
                fontFamily="'JetBrains Mono', monospace"
              >
                {t.v}
              </text>
            </g>
          ))}
          {/* needle */}
          <g className="score-needle">
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={CY - 104}
              stroke="#E8EDF0"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx={CX} cy={CY} r="6" fill="#0E1419" stroke="#E5A93C" strokeWidth="2" />
          </g>
        </svg>

        {/* readout + tier chip */}
        <div className="-mt-16 flex items-end gap-4">
          <p className="score-readout tabular font-mono text-[64px] font-medium leading-none text-txt">
            0
          </p>
          <div className="score-chip-wrap pb-1.5">
            <span className="score-chip inline-block rounded-md border border-amber/60 bg-amber/10 px-3 py-1.5 font-mono text-[13px] tracking-[0.12em] text-amber">
              GOOD
            </span>
          </div>
        </div>

        {/* Copy */}
        <p className="score-eyebrow eyebrow mt-10 text-amber">
          RUKPI SCORE · FINANCIAL IDENTITY
        </p>
        <h1 className="score-headline mt-6 max-w-3xl text-center font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-txt sm:text-[48px] lg:text-[64px]">
          Your transactions become your credit history.
        </h1>
        <p className="score-sub mt-6 max-w-xl text-center text-lg leading-[1.6] text-txt-sub">
          A 0–1000 score computed from live transaction telemetry. No paperwork. No collateral.
          Refreshed on every payment you make.
        </p>
      </div>
    </section>
  );
}
