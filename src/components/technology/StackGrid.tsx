import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STACK = [
  { name: "TYPESCRIPT", line: "End-to-end types" },
  { name: "HONO", line: "Routing at ~180k req/s" },
  { name: "POSTGRESQL", line: "Replicas, PITR, RLS" },
  { name: "DRIZZLE", line: "Typed ORM" },
  { name: "REDIS", line: "Cache, pub/sub, idempotency" },
  { name: "ZOD", line: "Runtime validation" },
  { name: "OPENAPI", line: "Auto-generated docs" },
  { name: "EXPO", line: "Mobile + OTA" },
];

export default function StackGrid() {
  return (
    <section className="bg-offwhite py-24 text-ltxt lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-teal">Stack</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
            A boringly rigorous stack.
          </h2>
        </motion.div>

        <div
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{ perspective: "800px" }}
        >
          {STACK.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="group rounded-xl border border-bordergray bg-white p-6 shadow-light-card transition-colors duration-300 hover:border-teal"
            >
              <p className="font-mono text-[14px] font-medium tracking-[0.08em] text-ltxt transition-colors duration-300 group-hover:text-teal">
                {s.name}
              </p>
              <p className="mt-2 text-[14px] leading-[1.6] text-ltxt-sub">{s.line}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
