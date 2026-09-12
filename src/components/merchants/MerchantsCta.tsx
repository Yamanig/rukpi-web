import { useRef } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

/** Magnetic pull (8px max) wrapper for primary CTAs. */
function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16 });
  const sy = useSpring(y, { stiffness: 180, damping: 16 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const mag = Math.hypot(dx, dy) || 1;
    const clamp = Math.min(8, mag * 0.15);
    x.set((dx / mag) * clamp);
    y.set((dy / mag) * clamp);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

const PARTICLES = [
  { top: "20%", d: "0s" },
  { top: "35%", d: "1.4s" },
  { top: "50%", d: "0.7s" },
  { top: "65%", d: "2.1s" },
  { top: "80%", d: "0.3s" },
];

export default function MerchantsCta() {
  return (
    <section className="relative overflow-hidden bg-teal-deep">
      {/* faint particle rails */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <div key={i} className="absolute inset-x-0 h-px bg-white/40" style={{ top: p.top }}>
            <span
              className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white"
              style={{ animation: `rail-pan 7s linear infinite`, animationDelay: p.d }}
            />
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-content px-6 py-24 text-center lg:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[760px] font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt sm:text-[48px]"
        >
          Put your business on the unified rail.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <Link to="/contact?topic=merchants" className="btn-primary group">
              Start Onboarding
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </Magnetic>
          <a href="mailto:merchants@rukpi.finance" className="btn-ghost group border-white/20">
            Talk to merchant team
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </a>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 font-mono text-[12px] uppercase tracking-[0.12em] text-white/50"
        >
          Pilot: up to 50 merchants · Mogadishu
        </motion.p>
      </div>
    </section>
  );
}
