import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** QR corners that pulse on hover. */
function QrIcon() {
  const corner = "M0 0 h10 M0 0 v10";
  const pos = [
    "translate(4,4)",
    "translate(36,4) scale(-1,1)",
    "translate(4,36) scale(1,-1)",
    "translate(36,36) scale(-1,-1)",
  ];
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
      {pos.map((t, i) => (
        <path
          key={i}
          d={corner}
          transform={t}
          fill="none"
          stroke="#00A3A1"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="vp-qr-corner"
        />
      ))}
      <rect x="16" y="16" width="8" height="8" fill="#00A3A1" rx="1.5" />
    </svg>
  );
}

/** Timer with a hand that spins on hover. */
function TimerIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
      <circle cx="20" cy="22" r="14" fill="none" stroke="#00A3A1" strokeWidth="2.5" />
      <path d="M16 4 h8 M20 4 v4" stroke="#00A3A1" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line
        x1="20"
        y1="22"
        x2="20"
        y2="12"
        stroke="#E5A93C"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="vp-timer-hand"
        style={{ transformOrigin: "20px 22px" }}
      />
    </svg>
  );
}

/** Settlement arrow whose dash flows on hover. */
function SettleIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
      <path
        d="M4 28 H30 M24 21 L31 28 L24 35"
        fill="none"
        stroke="#00A3A1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12 H36"
        fill="none"
        stroke="#E5A93C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 6"
        className="vp-settle-dash"
      />
    </svg>
  );
}

const CARDS: { icon: ReactNode; title: string; body: string; cls: string }[] = [
  {
    icon: <QrIcon />,
    title: "One QR, every wallet",
    body: "Stop juggling four QR stands. One EMVCo code accepts all four mobile-money networks plus bank rails.",
    cls: "vp-card-qr",
  },
  {
    icon: <TimerIcon />,
    title: "Sub-100ms at the counter",
    body: "Customers scan, verify your merchant badge, approve. Faster than counting change.",
    cls: "vp-card-timer",
  },
  {
    icon: <SettleIcon />,
    title: "T+1 settlement, guaranteed",
    body: "Daily settlement target: ≥95% of funds in your account within 24 hours.",
    cls: "vp-card-settle",
  },
];

export default function ValueProps() {
  return (
    <section className="bg-white">
      <style>{`
        .vp-card-qr:hover .vp-qr-corner { animation: vp-pulse 1.1s ease-in-out infinite; }
        @keyframes vp-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        .vp-card-timer:hover .vp-timer-hand { animation: vp-spin 1.2s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes vp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .vp-card-settle:hover .vp-settle-dash { animation: vp-flow 0.9s linear infinite; }
        @keyframes vp-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -24; } }
      `}</style>
      <div className="mx-auto max-w-content px-6 py-24 lg:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ltxt sm:text-[48px]"
        >
          Built for how Somali business actually runs.
        </motion.h2>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`${c.cls} group rounded-xl border border-bordergray bg-white p-8 shadow-light-card transition-all duration-300 ease-sovereign hover:-translate-y-1 hover:border-teal/60`}
            >
              {c.icon}
              <h3 className="mt-6 font-display text-2xl font-semibold leading-[1.3] text-ltxt">
                {c.title}
              </h3>
              <p className="mt-3 leading-[1.7] text-ltxt-sub">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
