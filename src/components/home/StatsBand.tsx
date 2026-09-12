import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { display: "155M", from: 0, to: 155, suffix: "M", label: "mobile-money transactions per month in the ecosystem RUKPI unifies" },
  { display: "<100ms", from: 0, to: 100, prefix: "<", suffix: "ms", label: "QR merchant payment response time" },
  { display: "99.99%", from: 0, to: 99.99, suffix: "%", decimals: 2, label: "uptime target" },
  { display: "150%", from: 0, to: 150, suffix: "%", label: "peak-load stress-test headroom" },
];

export default function StatsBand() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduced) {
        // teal baseline sweep behind the row
        gsap.from(".stats-baseline", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: scope.current, start: "top 75%" },
        });
        gsap.from(".stats-cell", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: scope.current, start: "top 75%" },
        });
      }

      gsap.utils.toArray<HTMLElement>(".stats-value").forEach((el, i) => {
        const to = Number(el.dataset.to);
        const decimals = Number(el.dataset.decimals ?? 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: reduced ? 0 : 1.4,
          delay: reduced ? 0 : i * 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = `${el.dataset.prefix ?? ""}${obj.v.toFixed(decimals)}${el.dataset.suffix ?? ""}`;
          },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative bg-ink-0 py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <p className="eyebrow text-center text-teal">Built for the scale that already exists</p>
        <div className="relative mt-14">
          <div className="stats-baseline pointer-events-none absolute inset-x-0 top-1/2 h-px bg-teal/30" aria-hidden="true" />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-ink-4/60 bg-ink-4/40 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="stats-cell bg-ink-0 p-8 lg:p-10">
                <p
                  className="stats-value tabular font-mono text-5xl font-medium text-teal lg:text-[64px] lg:leading-none"
                  data-to={s.to}
                  data-prefix={s.prefix ?? ""}
                  data-suffix={s.suffix ?? ""}
                  data-decimals={s.decimals ?? 0}
                >
                  {s.prefix ?? ""}0{s.suffix ?? ""}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-txt-sub">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
