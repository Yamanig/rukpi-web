import { motion } from "framer-motion";
import ScrambleText from "./ScrambleText";

const CELLS = [
  { stat: "WCAG 2.1 AA", body: "Accessible by default across the app ecosystem." },
  { stat: "99.99%", body: "Uptime target, backed by chaos-tested failover (RPO=0)." },
];

export default function Accessibility() {
  return (
    <section className="bg-ink-alt py-16 lg:py-20">
      <div className="mx-auto max-w-content px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CELLS.map((cell, i) => (
            <motion.div
              key={cell.stat}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="stat-cell bg-ink-1 shadow-teal-edge"
            >
              {/* console-boot scramble resolve, 0.8s */}
              <ScrambleText
                text={cell.stat}
                duration={0.8}
                delay={i * 0.15}
                className="tabular block font-mono text-4xl font-medium text-txt lg:text-5xl"
              />
              <p className="mt-3 text-[15px] leading-[1.7] text-txt-sub">{cell.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
