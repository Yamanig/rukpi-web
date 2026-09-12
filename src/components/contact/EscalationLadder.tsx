import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LEVELS = [
  { num: "01", level: "LEVEL 1", channel: "CHAT", target: "<5min", amber: false },
  { num: "02", level: "LEVEL 2", channel: "ENGINEERING", target: "<15min", amber: false },
  { num: "03", level: "LEVEL 3", channel: "ON-SITE", target: "<2h", amber: true },
  { num: "04", level: "LEVEL 4", channel: "WAR ROOM", target: "<30min", amber: true },
];

/**
 * Section 3 — Support escalation ladder (contact.md). Dark band.
 * Dedicated GSAP component (no Framer Motion in this tree): nodes stagger in,
 * connecting track draws with scroll scrub, teal dot loops the ladder
 * (~6s, 0.5s pause at each node, node glows on arrival).
 */
export default function EscalationLadder() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // Track draws in with scroll scrub (scaleX)
      gsap.fromTo(
        ".ladder-track",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top 78%", end: "top 30%", scrub: true },
        },
      );

      // Nodes stagger in
      gsap.from(".ladder-card", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 72%" },
      });

      // Dot loops the full ladder path (~6s; 0.5s pause at each node)
      const dot = scope.current?.querySelector<HTMLElement>(".ladder-dot");
      const nodeDots = gsap.utils.toArray<HTMLElement>(".ladder-node");
      if (!dot || nodeDots.length === 0) return;
      const pcts = ["0%", "33.333%", "66.666%", "100%"];
      const tl = gsap.timeline({ repeat: -1 });
      tl.set(dot, { left: pcts[0], opacity: 1 });
      nodeDots.forEach((el, i) => {
        tl.to(el, { scale: 1.6, duration: 0.2, ease: "power2.out" }); // glow on arrival
        tl.to(el, { scale: 1, duration: 0.2, ease: "power2.in" }, "+=0.5"); // pause at node
        if (i < nodeDots.length - 1) {
          tl.to(dot, { left: pcts[i + 1], duration: 0.8, ease: "power1.inOut" });
        }
      });
      tl.to(dot, { opacity: 0, duration: 0.3 }, "+=0.2");
      tl.set(dot, { left: pcts[0], opacity: 0 });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-dark-surface py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <p className="eyebrow text-teal">Support escalation</p>
        <h3 className="mt-4 max-w-3xl font-display text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-txt lg:text-[32px]">
          When things go wrong, here's exactly what happens.
        </h3>

        {/* Ladder (horizontal on desktop, stacked on mobile) */}
        <div className="relative mt-16 hidden lg:block">
          {/* Connecting track between node centers */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[7px] h-px">
            <div className="ladder-track h-full w-full bg-teal/40" />
            <div
              className="ladder-dot absolute -top-[3.5px] h-2 w-2 -translate-x-1/2 rounded-full bg-teal shadow-teal-glow"
              style={{ left: "0%" }}
            />
          </div>
          <div className="grid grid-cols-4">
            {LEVELS.map((l) => (
              <div key={l.num} className="ladder-card flex flex-col items-center px-4 text-center">
                <span
                  className={`ladder-node h-[15px] w-[15px] rounded-full border-2 ${
                    l.amber ? "border-amber bg-amber/20" : "border-teal bg-teal/20"
                  }`}
                />
                <p className="mt-6 font-mono text-[13px] tracking-[0.05em] text-txt-ter">
                  {l.num} · {l.level}
                </p>
                <p className="mt-2 font-display text-lg font-semibold tracking-[0.08em] text-txt">
                  {l.channel}
                </p>
                <p
                  className={`tabular mt-3 font-mono text-4xl font-medium lg:text-5xl ${
                    l.amber ? "text-amber-light" : "text-teal"
                  }`}
                >
                  {l.target}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked fallback (mobile) */}
        <div className="mt-12 space-y-4 lg:hidden">
          {LEVELS.map((l) => (
            <div
              key={l.num}
              className="ledger-card flex items-center justify-between gap-4 p-5"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${l.amber ? "bg-amber" : "bg-teal"}`}
                />
                <div>
                  <p className="font-mono text-[12px] tracking-[0.05em] text-txt-ter">
                    {l.num} · {l.level}
                  </p>
                  <p className="mt-0.5 font-display text-base font-semibold tracking-[0.08em] text-txt">
                    {l.channel}
                  </p>
                </div>
              </div>
              <p
                className={`tabular font-mono text-2xl font-medium ${
                  l.amber ? "text-amber-light" : "text-teal"
                }`}
              >
                {l.target}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
