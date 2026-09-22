import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const HEADLINE = "Security is not a feature. It's the foundation.";

const CHIPS = ["TLS 1.3 ONLY", "AES-256-GCM", "HSM-BACKED KEYS", "OWASP TOP 10", "WCAG 2.1 AA"];

/**
 * Vault-dial motif: concentric thin teal rings with a single amber tick,
 * rotating on a 90s revolution (security.md Section 1). Pure CSS rotation
 * so it stays off the React render path.
 */
function VaultRings() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 720 720"
        className="vault-spin h-[560px] w-[560px] opacity-40 lg:h-[760px] lg:w-[760px]"
      >
        <circle cx="360" cy="360" r="340" fill="none" stroke="#00A3A1" strokeOpacity="0.22" strokeWidth="1" />
        <circle
          cx="360"
          cy="360"
          r="296"
          fill="none"
          stroke="#00A3A1"
          strokeOpacity="0.3"
          strokeWidth="1"
          strokeDasharray="2 10"
        />
        <circle cx="360" cy="360" r="248" fill="none" stroke="#00A3A1" strokeOpacity="0.18" strokeWidth="1" />
        <circle
          cx="360"
          cy="360"
          r="204"
          fill="none"
          stroke="#00A3A1"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeDasharray="40 14"
        />
        <circle cx="360" cy="360" r="156" fill="none" stroke="#00A3A1" strokeOpacity="0.14" strokeWidth="1" />
        {/* single amber tick on the outermost ring */}
        <line
          x1="360"
          y1="20"
          x2="360"
          y2="44"
          stroke="#E5A93C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* small teal tick accents */}
        <line x1="360" y1="112" x2="360" y2="128" stroke="#00A3A1" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="360" y1="592" x2="360" y2="608" stroke="#00A3A1" strokeOpacity="0.5" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function SecurityHero() {
  return (
    <section className="relative -mt-[72px] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-ink-0 pb-24 pt-[160px]">
      <style>{`
        @keyframes vault-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .vault-spin { animation: vault-rotate 90s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .vault-spin { animation: none !important; }
        }
      `}</style>

      <VaultRings />

      {/* readability vignette behind copy */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-0/80 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="eyebrow text-teal"
        >
          Security &amp; Trust
        </motion.p>

        {/* word-level reveal, calm 0.05s stagger */}
        <h1 className="mt-6 font-display text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-txt sm:text-[52px] lg:text-[64px]">
          {HEADLINE.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: EASE }}
              className="inline-block"
            >
              {word}
              {i < HEADLINE.split(" ").length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-[1.7] text-txt-sub"
        >
          RUKPI is built on the principle its name carries — Rukun, a pillar. Encryption
          everywhere, keys in hardware, every state change journaled, and compliance enforced in
          the data model itself.
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {CHIPS.map((chip, i) => (
            <motion.span
              key={chip}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.08, ease: EASE }}
              className="rounded-md border border-teal/40 px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-teal"
            >
              {chip}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
