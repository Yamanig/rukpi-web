import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  { label: "RUKPI PAY", to: "/products/pay" },
  { label: "RUKPI SCORE", to: "/products/score" },
  { label: "For Merchants", to: "/merchants" },
  { label: "Security & Trust", to: "/security" },
];

/**
 * 404 — brand-styled dead end. Dark canvas, mono hash motif,
 * rail lines echoing the Footer/NetworkRails language.
 */
export default function NotFound() {
  return (
    <section className="relative mx-auto flex min-h-[80dvh] max-w-content flex-col justify-center overflow-hidden px-6 py-24">
      {/* faint rail lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g stroke="#00A3A1" strokeWidth="1" fill="none">
          <path d="M-40 560 C 300 480, 700 520, 1480 300" />
          <path d="M-40 600 C 360 500, 760 540, 1480 360" />
          <path d="M-40 520 C 240 460, 620 500, 1480 240" />
        </g>
      </svg>

      <div className="relative">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow text-teal"
        >
          Error 404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 font-display text-6xl font-extrabold leading-[1.05] tracking-[-0.02em] text-txt sm:text-7xl"
        >
          This route never settled.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-txt-sub"
        >
          The page you're looking for isn't on any rail we operate. Double-check
          the address — every other transaction routes through below.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 font-mono text-[12px] tracking-[0.06em] text-txt-ter"
        >
          STATUS: ROUTE_NOT_FOUND · LEDGER UNCHANGED
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link to="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to home
          </Link>
          <Link to="/contact" className="btn-ghost">
            Report a problem
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 border-t border-white/[0.06] pt-8"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-txt-ter">
            Popular destinations
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group flex items-center gap-1.5 text-[14px] font-medium text-txt-sub transition-colors hover:text-teal"
                >
                  {l.label}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
