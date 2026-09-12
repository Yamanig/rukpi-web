import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

const CHECKLIST = [
  "Verified merchant badge on every decode",
  "Itemized confirmation before you approve",
  "SHA-256 anti-tampering hash on amount, merchant, and session",
  "Certificate pinning + biometric attestation",
  "Sub-100ms merchant response time",
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Success-green check with SVG stroke draw-on. */
function DrawCheck({ delay }: { delay: number }) {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" aria-hidden="true">
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="#10B981"
        strokeOpacity="0.3"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4, delay, ease: EASE }}
      />
      <motion.path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4, delay: delay + 0.15, ease: EASE }}
      />
    </svg>
  );
}

export default function ScanToPay() {
  return (
    <section className="bg-ink-alt py-24 lg:py-32">
      <style>{`
        @keyframes pay-scan-y {
          0%, 100% { top: 16%; }
          50% { top: 74%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pay-scan-beam { animation: none !important; top: 45%; }
        }
      `}</style>
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        {/* Device */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mx-auto w-full max-w-[320px]"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-ink-4/60 bg-ink-0 shadow-teal-edge">
            <img
              src="/pay-scan.png"
              alt="RUKPI PAY scan-to-pay viewfinder with teal corner brackets and a verified merchant badge"
              className="block h-auto w-full"
            />
            {/* scanning beam */}
            <div
              className="pay-scan-beam pointer-events-none absolute inset-x-[14%] h-0.5 rounded-full bg-teal shadow-[0_0_16px_rgba(0,163,161,0.9)]"
              style={{ animation: "pay-scan-y 2s ease-in-out infinite" }}
              aria-hidden="true"
            />
          </div>
          {/* verified badge — pulses once on entry */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: [0.8, 1.12, 1] }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="absolute -right-4 top-8 flex items-center gap-2 rounded-md border border-amber/50 bg-amber/10 px-3 py-2 backdrop-blur-sm"
          >
            <BadgeCheck className="h-4 w-4 text-amber" strokeWidth={1.5} />
            <span className="font-mono text-[12px] tracking-[0.1em] text-amber">VERIFIED</span>
          </motion.div>
        </motion.div>

        {/* Copy + checklist */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="eyebrow text-teal">Scan-to-Pay</p>
            <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
              EMVCo-standard QR, verified merchants, anti-tamper by design.
            </h2>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.12, delayChildren: 0.2 }}
            className="mt-10 space-y-5"
          >
            {CHECKLIST.map((item, i) => (
              <motion.li
                key={item}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className="flex items-start gap-4"
              >
                <DrawCheck delay={0.2 + i * 0.12} />
                <span className="text-base leading-relaxed text-txt-sub">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
