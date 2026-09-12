import { motion } from "framer-motion";
import { Check } from "lucide-react";

const CHECKLIST = [
  "Live floor-plan grid with per-table status",
  "Order queue that syncs front-of-house and kitchen",
  "Kitchen display with real-time order tickets",
  "Pay-at-table via RUKPI QR — no card machines",
];

/** Status dots overlaid on the floor-plan image; illuminate sequentially on entry. */
const TABLE_DOTS: { top: string; left: string; color: string }[] = [
  { top: "18%", left: "16%", color: "#10B981" },
  { top: "18%", left: "38%", color: "#E5A93C" },
  { top: "30%", left: "58%", color: "#00A3A1" },
  { top: "46%", left: "20%", color: "#00A3A1" },
  { top: "46%", left: "44%", color: "#10B981" },
  { top: "60%", left: "66%", color: "#E5A93C" },
  { top: "70%", left: "30%", color: "#10B981" },
  { top: "72%", left: "52%", color: "#00A3A1" },
];

export default function Resto() {
  return (
    <section id="resto" className="bg-offwhite scroll-mt-[72px]">
      <div className="mx-auto grid max-w-content items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16 lg:py-32">
        {/* Floor plan */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-xl border border-bordergray shadow-light-card">
            <img
              src="/resto-floor.png"
              alt="RUKPI RESTO live floor plan with per-table status"
              className="block w-full"
            />
            {/* illuminating status dots */}
            {TABLE_DOTS.map((d, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ delay: 0.4 + i * 0.1, type: "spring", bounce: 0.5 }}
                className="absolute h-3 w-3 rounded-full"
                style={{
                  top: d.top,
                  left: d.left,
                  backgroundColor: d.color,
                  boxShadow: `0 0 12px ${d.color}`,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.08em] text-ltxt-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Free</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber" /> Awaiting pay</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal" /> In service</span>
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow text-teal">RUKPI Resto · Hospitality</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ltxt sm:text-[48px]">
            From floor plan to kitchen ticket, in real time.
          </h2>
          <ul className="mt-10 space-y-5">
            {CHECKLIST.map((c, i) => (
              <motion.li
                key={c}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-teal/40 bg-teal/10">
                  <Check className="h-3.5 w-3.5 text-teal" strokeWidth={2} />
                </span>
                <span className="leading-[1.7] text-ltxt-sub">{c}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
