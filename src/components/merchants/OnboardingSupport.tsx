import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MILESTONES = [
  { label: "KYC & business verification", chip: "STEP 1–3" },
  { label: "Device provisioning", chip: "STEP 4–5" },
  { label: "Staff training", chip: "STEP 6–7" },
  { label: "Shadow mode — live traffic, zero risk", chip: "STEP 8–10" },
  { label: "Go-live", chip: "STEP 11" },
];

const LADDER = [
  { level: "CHAT", time: "<5MIN", note: "median target", color: "#00A3A1" },
  { level: "ENGINEERING", time: "<15MIN", note: "median target", color: "#00A3A1" },
  { level: "ON-SITE", time: "<2H", note: "median target", color: "#E5A93C" },
  { level: "WAR ROOM", time: "<30MIN", note: "median target", color: "#E5A93C" },
];

export default function OnboardingSupport() {
  const lineScope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(".ob-line", { scaleY: 1 });
        gsap.set(".ob-node", { opacity: 1, scale: 1 });
        return;
      }
      gsap.set(".ob-line", { scaleY: 0, transformOrigin: "top" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: lineScope.current, start: "top 75%" },
        defaults: { ease: "power4.out" },
      });
      tl.to(".ob-line", { scaleY: 1, duration: 1.4, ease: "power2.inOut" }).from(
        ".ob-node",
        { opacity: 0, scale: 0, duration: 0.4, stagger: 0.28, ease: "back.out(2)" },
        0.15,
      );
    },
    { scope: lineScope },
  );

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-content gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">
        {/* Onboarding */}
        <div ref={lineScope}>
          <h3 className="font-display text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-ltxt sm:text-[32px]">
            From signup to live in days, not months.
          </h3>
          <div className="relative mt-10 pl-8">
            {/* drawn connector line */}
            <span
              className="ob-line absolute left-[11px] top-2 bottom-2 w-px bg-teal/60"
              aria-hidden="true"
            />
            <ol className="space-y-7">
              {MILESTONES.map((m) => (
                <li key={m.label} className="relative">
                  <span
                    className="ob-node absolute -left-8 top-1 h-[22px] w-[22px] rounded-full border-2 border-teal bg-white"
                    style={{ boxShadow: "0 0 0 4px rgba(0,163,161,0.12)" }}
                    aria-hidden="true"
                  />
                  <p className="font-medium leading-[1.6] text-ltxt">{m.label}</p>
                  <span className="mt-1 inline-block rounded-md border border-bordergray px-2 py-0.5 font-mono text-[11px] tracking-[0.06em] text-ltxt-muted">
                    {m.chip}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <span className="mt-8 inline-block rounded-md border border-amber/50 bg-amber/10 px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-[#9A6B14]">
            SHADOW MODE ≥48H BEFORE GO-LIVE
          </span>
        </div>

        {/* Support escalation ladder */}
        <div>
          <h3 className="font-display text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-ltxt sm:text-[32px]">
            Four-level escalation, measured in minutes.
          </h3>
          <div className="mt-10 space-y-4">
            {LADDER.map((l, i) => (
              <motion.div
                key={l.level}
                initial={{ opacity: 0, x: 48 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex items-center justify-between rounded-xl border border-bordergray bg-white p-5 shadow-light-card transition-all duration-300 hover:-translate-y-0.5"
                style={{ borderLeft: `4px solid ${l.color}` }}
              >
                <span className="font-mono text-[13px] font-medium tracking-[0.08em] text-ltxt">
                  {l.level}
                </span>
                <span
                  className="font-mono text-[22px] font-medium tabular"
                  style={{ color: l.color }}
                >
                  {l.time}
                </span>
                {/* hover tooltip */}
                <span className="pointer-events-none absolute -top-3 right-4 -translate-y-full rounded-md border border-bordergray bg-ltxt px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {l.note}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
