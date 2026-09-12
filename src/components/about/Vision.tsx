import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const RINGS = [
  { label: "MOGADISHU", size: 200 },
  { label: "SOMALIA", size: 360 },
  { label: "EAST AFRICA", size: 520 },
  { label: "THE CONTINENT", size: 680 },
];

export default function Vision() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(".vision-ring", { scale: 1, opacity: 1 });
        gsap.set(".vision-ring-label", { opacity: 1 });
        return;
      }

      gsap.from(".vision-head", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      });

      // pinned 120vh: rings expand outward with scroll (staggered), labels fade in at full radius
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".vision-stage",
          start: "top top",
          end: "+=120%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
        defaults: { ease: "power2.out" },
      });
      tl.fromTo(".vision-core", { scale: 0 }, { scale: 1, duration: 0.15, ease: "back.out(2)" });
      RINGS.forEach((_, i) => {
        tl.fromTo(
          `.vision-ring-${i}`,
          { scale: 0.15, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          0.15 + i * 0.15,
        ).fromTo(
          `.vision-label-${i}`,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.2 },
          0.15 + i * 0.15 + 0.35,
        );
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-ink-0">
      <div className="vision-stage relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
        {/* expanding rings visual */}
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {RINGS.map((r, i) => (
            <div
              key={r.label}
              className={`vision-ring vision-ring-${i} absolute rounded-full border border-teal/30`}
              style={{ width: r.size, height: r.size, maxWidth: "92vw", maxHeight: "92vw" }}
            />
          ))}
          {/* Mogadishu node — pulses continuously (amber, 2s) */}
          <span className="vision-core relative flex h-4 w-4 items-center justify-center">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60"
              style={{ animationDuration: "2s" }}
            />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber" />
          </span>
        </div>

        {/* ring labels in mono */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {RINGS.map((r, i) => (
            <span
              key={r.label}
              className={`vision-ring-label vision-label-${i} absolute left-1/2 font-mono text-[11px] uppercase tracking-[0.18em] text-teal/80`}
              style={{
                top: `calc(50% - ${r.size / 2}px - 18px)`,
                transform: "translateX(-50%)",
              }}
            >
              {r.label}
            </span>
          ))}
        </div>

        {/* copy */}
        <div className="vision-head relative z-10 mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            From Mogadishu, for the continent.
          </h2>
          <p className="mt-6 text-lg leading-[1.7] text-txt-sub">
            Somalia is not our test market — it&apos;s our proof point. If infrastructure survives
            and thrives here, it works anywhere on earth.
          </p>
        </div>
      </div>
    </section>
  );
}
