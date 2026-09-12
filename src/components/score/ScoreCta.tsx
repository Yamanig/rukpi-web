import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// mini gauge geometry (140x90 viewBox)
const CX = 70;
const CY = 84;
const R = 56;
const ARC_LEN = Math.PI * R;
const VALUE = 742;
const NEEDLE_BASE = -90 + (VALUE / 1000) * 180;

/** Miniaturized hero gauge, idling with a gentle needle sway. */
function MiniGauge() {
  return (
    <svg
      viewBox="0 0 140 90"
      className="w-[140px]"
      role="img"
      aria-label="RUKPI SCORE mini gauge idling at 742"
    >
      <defs>
        <linearGradient id="score-grad-mini" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00A3A1" />
          <stop offset="100%" stopColor="#E5A93C" />
        </linearGradient>
      </defs>
      <path
        d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
        fill="none"
        stroke="#2A3A47"
        strokeOpacity="0.5"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
        fill="none"
        stroke="url(#score-grad-mini)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={ARC_LEN}
        strokeDashoffset={ARC_LEN * (1 - VALUE / 1000)}
      />
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: `${CX}px ${CY}px` }}
        animate={{ rotate: [NEEDLE_BASE - 1, NEEDLE_BASE + 1, NEEDLE_BASE - 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <line
          x1={CX}
          y1={CY}
          x2={CX}
          y2={CY - 44}
          stroke="#E8EDF0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r="4" fill="#0E1419" stroke="#E5A93C" strokeWidth="1.5" />
      </motion.g>
      <text
        x={CX}
        y={CY - 18}
        textAnchor="middle"
        fill="#E8EDF0"
        fontSize="13"
        fontFamily="'JetBrains Mono', monospace"
      >
        {VALUE}
      </text>
    </svg>
  );
}

export default function ScoreCta() {
  return (
    <section className="relative overflow-hidden bg-ink-0 py-28 lg:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex justify-center"
        >
          <MiniGauge />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mt-8 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl"
        >
          Every payment builds your future.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/contact" className="btn-primary group">
            Get the App
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
          <Link to="/products/pay" className="btn-ghost group">
            See how payments work
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 font-mono text-[12px] tracking-[0.08em] text-txt-ter"
        >
          SCORE REFRESHES ON EVERY TRANSACTION
        </motion.p>
      </div>
    </section>
  );
}
