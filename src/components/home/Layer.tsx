import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NODES = [
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
const STATS = [
  { value: 7, suffix: "", label: "rails unified" },
  { value: 1, suffix: "", label: "USD unit" },
  { value: 100, prefix: "<", suffix: "ms", label: "settlement" },
];

// node positions on a circle (viewBox 600x600, core at 300,300, r=210)
const R = 210;
const C = 300;
const nodePos = NODES.map((_, i) => {
  const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
});

export default function Layer() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lines = gsap.utils.toArray<SVGLineElement>(".layer-line");

      // prepare draw state
      lines.forEach((l) => {
        const len = Math.hypot(
          Number(l.dataset.x2) - Number(l.dataset.x1),
          Number(l.dataset.y2) - Number(l.dataset.y1),
        );
        l.style.strokeDasharray = `${len}`;
        l.style.strokeDashoffset = reduced ? "0" : `${len}`;
      });
      if (reduced) {
        gsap.set(".layer-particle", { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 70%" },
        defaults: { ease: "power4.out" },
      });
      tl.from(".layer-core", { scale: 0.8, opacity: 0, duration: 0.8, transformOrigin: "center" })
        .to(lines, { strokeDashoffset: 0, duration: 0.4, stagger: 0.15 }, 0.3)
        .from(
          ".layer-node",
          { scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.12, transformOrigin: "center" },
          0.4,
        )
        .to(".layer-particle", { opacity: 1, duration: 0.6 }, 1.4)
        .from(".layer-stat", { opacity: 0, y: 24, duration: 0.6, stagger: 0.1 }, 1.0);

      // count-up stat figures
      gsap.utils.toArray<HTMLElement>(".layer-stat-value").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = `${el.dataset.prefix ?? ""}${Math.round(obj.v)}${el.dataset.suffix ?? ""}`;
          },
        });
      });

      // teal glow pulse on the core
      gsap.to(".layer-core-glow", {
        opacity: 0.5,
        scale: 1.15,
        transformOrigin: "center",
        duration: 1.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-offwhite py-24 text-ltxt lg:py-36">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-teal">The RUKPI Layer</p>
          <h2 className="mt-5 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
            One real-time, USD-denominated clearing layer.
          </h2>
          <p className="mt-6 text-[17px] leading-[1.7] text-ltxt-sub">
            Through a single protocol-agnostic interface, RUKPI unifies seven heterogeneous
            rails behind one contract. Funds from any source become fully fungible USD —
            instantly, atomically, exactly once.
          </p>
        </div>

        {/* Diagram */}
        <div className="mx-auto mt-16 max-w-[560px]">
          <svg viewBox="0 0 600 600" className="h-auto w-full" role="img" aria-label="RUKPI clearing layer connecting six payment rails">
            <defs>
              <radialGradient id="coreGlow">
                <stop offset="0%" stopColor="#00A3A1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00A3A1" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* connection lines */}
            {nodePos.map((p, i) => (
              <line
                key={NODES[i]}
                className="layer-line"
                data-x1={C}
                data-y1={C}
                data-x2={p.x}
                data-y2={p.y}
                x1={C}
                y1={C}
                x2={p.x}
                y2={p.y}
                stroke="#00A3A1"
                strokeWidth="1.5"
                opacity="0.8"
              />
            ))}
            {/* settlement particles flowing outward */}
            {nodePos.map((p, i) => (
              <circle key={`pt-${NODES[i]}`} className="layer-particle" r="3.5" fill="#00A3A1" opacity="0">
                <animateMotion
                  dur={`${3.2 + (i % 3) * 0.7}s`}
                  begin={`${i * 0.45}s`}
                  repeatCount="indefinite"
                  path={`M ${C} ${C} L ${p.x} ${p.y}`}
                />
              </circle>
            ))}
            {/* core */}
            <circle className="layer-core-glow" cx={C} cy={C} r="90" fill="url(#coreGlow)" />
            <g className="layer-core">
              <circle cx={C} cy={C} r="56" fill="#0B2F35" stroke="#00A3A1" strokeWidth="2" />
              <circle cx={C} cy={C} r="44" fill="none" stroke="#00A3A1" strokeWidth="1" opacity="0.5" />
              <text
                x={C}
                y={C + 6}
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontWeight="800"
                fontSize="22"
                letterSpacing="2"
              >
                RUKPI
              </text>
            </g>
            {/* outer rail nodes */}
            {nodePos.map((p, i) => (
              <g key={`n-${NODES[i]}`} className="layer-node">
                <rect
                  x={p.x - 62}
                  y={p.y - 24}
                  width="124"
                  height="48"
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#E2E8F0"
                />
                <circle cx={p.x - 44} cy={p.y} r="4" fill="#00A3A1" />
                <text
                  x={p.x + 8}
                  y={p.y + 4}
                  textAnchor="middle"
                  fill="#090D10"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="13"
                  letterSpacing="1"
                >
                  {NODES[i]}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Stat cells (light) */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="layer-stat rounded-xl border border-bordergray bg-white p-6 text-center shadow-light-card"
            >
              <p
                className="layer-stat-value tabular font-mono text-4xl font-medium text-teal"
                data-value={s.value}
                data-prefix={s.prefix ?? ""}
                data-suffix={s.suffix ?? ""}
              >
                {s.prefix ?? ""}0{s.suffix ?? ""}
              </p>
              <p className="mt-2 text-sm font-medium text-ltxt-sub">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
