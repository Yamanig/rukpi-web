import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, BadgeCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SCORE = 782;
const MAX = 1000;
// gauge: 240° arc from -210° to 30°
const ARC_START = -210;
const ARC_SWEEP = 240;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const s = polar(cx, cy, r, from);
  const e = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export default function ScoreTeaser() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const arc = scope.current?.querySelector<SVGPathElement>(".score-arc");
      const needle = scope.current?.querySelector<SVGGElement>(".score-needle");
      const readout = scope.current?.querySelector<HTMLElement>(".score-readout");
      if (!arc || !needle || !readout) return;

      const arcLen = arc.getTotalLength();
      arc.style.strokeDasharray = `${arcLen}`;

      const setScore = (v: number) => {
        const frac = v / MAX;
        arc.style.strokeDashoffset = `${arcLen * (1 - frac)}`;
        const deg = ARC_START + ARC_SWEEP * frac;
        needle.setAttribute("transform", `rotate(${deg + 90} 300 300)`);
        readout.textContent = `${Math.round(v)} / ${MAX}`;
      };

      if (reduced) {
        setScore(SCORE);
        return;
      }

      arc.style.strokeDashoffset = `${arcLen}`;
      const obj = { v: 0 };
      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 65%" },
        defaults: { ease: "power2.out" },
      });
      tl.from(".score-copy > *", { opacity: 0, y: 24, duration: 0.7, stagger: 0.1, ease: "power4.out" })
        .to(
          obj,
          {
            // overshoot 5% then settle (needle settle animation)
            keyframes: [
              { v: SCORE * 1.05, duration: 1.2 },
              { v: SCORE, duration: 0.4, ease: "power2.inOut" },
            ],
            onUpdate: () => setScore(obj.v),
          },
          0.2,
        )
        .fromTo(
          ".score-tier",
          { opacity: 0, rotateX: -90, transformOrigin: "center" },
          { opacity: 1, rotateX: 0, duration: 0.5, ease: "back.out(1.6)" },
          "-=0.2",
        );
    },
    { scope },
  );

  return (
    <section ref={scope} className="overflow-hidden bg-ink-0 py-24 lg:py-36">
      <div className="mx-auto grid max-w-content items-center gap-16 px-6 lg:grid-cols-2">
        {/* Left content */}
        <div className="score-copy">
          <p className="eyebrow text-amber">RUKPI SCORE</p>
          <h2 className="mt-5 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            Your transactions become your credit history.
          </h2>
          <p className="mt-6 max-w-lg text-[17px] leading-[1.7] text-txt-sub">
            A 0–1000 score computed from live transaction telemetry — refreshed on every
            payment, with full explainability. Built to unlock Earned Wage Access and formal
            credit for the first time.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-md border border-amber/40 bg-amber/[0.12] px-3 py-1.5">
            <BadgeCheck className="h-4 w-4 text-amber" strokeWidth={1.5} />
            <span className="font-mono text-[12px] tracking-[0.08em] text-amber-light">
              VERIFIED TELEMETRY
            </span>
          </div>
          <div className="mt-8">
            <Link to="/products/score" className="btn-ghost-amber group">
              How the Score works
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>

        {/* Right gauge */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <img
            src="/score-dial-bg.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full rounded-full object-cover opacity-50"
          />
          <svg viewBox="0 0 600 600" className="relative h-auto w-full" role="img" aria-label={`RUKPI Score gauge showing ${SCORE} of ${MAX}`}>
            {/* track */}
            <path
              d={arcPath(300, 300, 220, ARC_START, ARC_START + ARC_SWEEP)}
              fill="none"
              stroke="#2A3A47"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* value arc */}
            <path
              className="score-arc"
              d={arcPath(300, 300, 220, ARC_START, ARC_START + ARC_SWEEP)}
              fill="none"
              stroke="url(#amberGrad)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E5A93C" />
                <stop offset="100%" stopColor="#F0C76A" />
              </linearGradient>
            </defs>
            {/* needle */}
            <g className="score-needle" transform={`rotate(${ARC_START + 90} 300 300)`}>
              <line x1="300" y1="300" x2="300" y2="120" stroke="#F0C76A" strokeWidth="3" strokeLinecap="round" />
              <circle cx="300" cy="300" r="10" fill="#E5A93C" />
            </g>
            <text
              className="score-readout tabular"
              x="300"
              y="420"
              textAnchor="middle"
              fill="#E8EDF0"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="44"
              fontWeight="500"
            >
              0 / {MAX}
            </text>
          </svg>
          <div className="score-tier absolute left-1/2 top-[62%] -translate-x-1/2 rounded-md border border-amber/50 bg-amber-glow px-4 py-1.5">
            <span className="font-mono text-[13px] font-medium tracking-[0.08em] text-ink-0">
              EXCELLENT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
