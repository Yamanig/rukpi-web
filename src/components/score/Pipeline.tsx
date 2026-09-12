import { motion } from "framer-motion";
import { Activity, Cpu, Gauge } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STEPS = [
  {
    icon: Activity,
    title: "Telemetry",
    body: "Every payment, top-up, and receipt streams into your profile in real time.",
  },
  {
    icon: Cpu,
    title: "Model",
    body: "A versioned scoring model weighs recency, consistency, velocity, and network health.",
    thinking: true,
  },
  {
    icon: Gauge,
    title: "Score",
    body: "0–1000, refreshed on every transaction. Watch it move the moment you pay.",
  },
];

/** Marching dashed data-flow arrow between columns. */
function FlowArrow() {
  return (
    <svg
      viewBox="0 0 80 24"
      className="hidden h-6 w-16 shrink-0 lg:block"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="0"
        y1="12"
        x2="64"
        y2="12"
        stroke="#00A3A1"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        className="score-dash-march"
      />
      <path d="M62 6l10 6-10 6" stroke="#00A3A1" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function Pipeline() {
  return (
    <section className="bg-ink-0 py-24 lg:py-32">
      <style>{`
        @keyframes score-dash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -12; }
        }
        .score-dash-march { animation: score-dash 1s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .score-dash-march { animation: none !important; }
        }
      `}</style>
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-amber">How It Works</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            From payments to proof, in three steps.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.15 }}
          className="mt-16 flex flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-4"
        >
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex flex-1 flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-4">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                }}
                className="ledger-card flex-1 p-8 text-center lg:text-left"
              >
                <div className="flex items-center justify-center gap-4 lg:justify-start">
                  <motion.span
                    animate={s.thinking ? { opacity: [1, 0.45, 1] } : undefined}
                    transition={s.thinking ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
                    className="inline-flex"
                  >
                    <s.icon
                      className={`h-7 w-7 ${s.thinking ? "text-amber" : "text-teal"}`}
                      strokeWidth={1.5}
                    />
                  </motion.span>
                  <span className="font-mono text-[13px] tracking-[0.1em] text-txt-ter">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-txt">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-txt-sub">{s.body}</p>
              </motion.div>
              {i < STEPS.length - 1 && <FlowArrow />}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
