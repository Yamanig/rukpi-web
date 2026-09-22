import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Database, Globe, Server, Smartphone, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const NODES: { name: string; icon: LucideIcon }[] = [
  { name: "DATABASE", icon: Database },
  { name: "API", icon: Server },
  { name: "WEB", icon: Globe },
  { name: "MOBILE", icon: Smartphone },
];

const BULLETS = [
  "Bun/Node + TypeScript end-to-end",
  "Hono API framework (~180k req/s routing)",
  "Drizzle ORM + PostgreSQL (read replicas, PITR, row-level security)",
  "Zod validation",
  "Auto-generated OpenAPI",
  "Redis (caching, idempotency, sessions, rate limiting, pub/sub)",
  "TanStack Start merchant portal",
  "React Native (Expo) consumer apps with OTA updates",
];

/** Marching dashed arrow between pipeline nodes. */
function MarchArrow({ lit }: { lit: boolean }) {
  return (
    <svg
      viewBox="0 0 80 24"
      className="hidden h-6 w-14 shrink-0 md:block lg:w-20"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="0"
        y1="12"
        x2="62"
        y2="12"
        stroke={lit ? "#00A3A1" : "#2A3A47"}
        strokeWidth="1.5"
        strokeDasharray="6 6"
        className="tsl-dash-march"
        style={{ transition: "stroke 0.2s" }}
      />
      <path
        d="M60 6l10 6-10 6"
        stroke={lit ? "#00A3A1" : "#2A3A47"}
        strokeWidth="1.5"
        fill="none"
        style={{ transition: "stroke 0.2s" }}
      />
    </svg>
  );
}

export default function TypeSafeLoop() {
  const [pulse, setPulse] = useState(-1); // index of node currently flashing
  const [ok, setOk] = useState<boolean[]>(NODES.map(() => false));
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const simulate = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setOk(NODES.map(() => false));
    setPulse(0);
    NODES.forEach((_, i) => {
      // flash node i, then show its TYPES OK toast (0.25s per hop)
      timers.current.push(
        window.setTimeout(() => {
          setPulse(i);
          setOk((prev) => prev.map((v, j) => (j === i ? true : v)));
        }, i * 250),
      );
    });
    // settle after the last hop
    timers.current.push(
      window.setTimeout(() => setPulse(-1), NODES.length * 250 + 200),
    );
    timers.current.push(
      window.setTimeout(() => setOk(NODES.map(() => false)), NODES.length * 250 + 2200),
    );
  };

  const running = pulse >= 0;

  return (
    <section className="bg-ink-0 py-24 lg:py-32">
      <style>{`
        @keyframes tsl-dash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -12; }
        }
        .tsl-dash-march { animation: tsl-dash 1s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tsl-dash-march { animation: none !important; }
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
          <p className="eyebrow text-teal">The Type-Safe Loop</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            One schema change propagates at compile time.
          </h2>
        </motion.div>

        {/* mono caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 text-center font-mono text-[13px] tracking-[0.12em] text-txt-ter"
        >
          ONE SCHEMA CHANGE PROPAGATES AT COMPILE TIME
        </motion.p>

        {/* pipeline diagram */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.12 }}
          className="mt-10 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-2"
        >
          {NODES.map((n, i) => (
            <div key={n.name} className="flex flex-col items-center gap-6 md:flex-row md:gap-2">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className="relative"
              >
                <div
                  className={`flex h-24 w-32 flex-col items-center justify-center gap-2 rounded-xl border bg-ink-1 transition-all duration-200 ${
                    pulse === i
                      ? "border-teal shadow-teal-glow"
                      : "border-ink-4/60 shadow-teal-edge"
                  }`}
                >
                  <n.icon
                    className={`h-6 w-6 transition-colors ${pulse === i ? "text-teal" : "text-txt-sub"}`}
                    strokeWidth={1.5}
                  />
                  <span className="font-mono text-[12px] tracking-[0.1em] text-txt">
                    {n.name}
                  </span>
                </div>
                {/* TYPES OK toast */}
                <AnimatePresence>
                  {ok[i] && (
                    <motion.span
                      initial={{ opacity: 0, y: 8, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 480, damping: 24 }}
                      className="absolute -top-9 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-md border border-success/40 bg-ink-1 px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-success"
                    >
                      <Check className="h-3 w-3" strokeWidth={2.5} /> TYPES OK
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              {i < NODES.length - 1 && <MarchArrow lit={pulse === i} />}
            </div>
          ))}
        </motion.div>

        {/* simulate button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-12 flex justify-center"
        >
          <button
            type="button"
            onClick={simulate}
            disabled={running}
            className="btn-primary group disabled:cursor-wait disabled:opacity-60"
          >
            <Zap className="h-4 w-4" strokeWidth={1.5} />
            {running ? "Propagating…" : "Simulate schema change"}
          </button>
        </motion.div>

        {/* stack bullets */}
        <ul className="mx-auto mt-14 grid max-w-4xl gap-x-10 gap-y-3 sm:grid-cols-2">
          {BULLETS.map((b, i) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="flex items-start gap-3 text-[15px] leading-[1.7] text-txt-sub"
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
              {b}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
